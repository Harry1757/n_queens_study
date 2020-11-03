// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function () {
  /* eslint-disable */
  window.Board = Backbone.Model.extend({
    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log(
          'Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:'
        );
        console.log(
          '\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: const board = new Board({n:5})',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: grey;'
        );
        console.log(
          '\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: const board = new Board([[1,0,0],[0,1,0],[0,0,1]])',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: blue;',
          'color: black;',
          'color: grey;'
        );
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    // 체스 판의 모든 행 배열을 반환합니다.
    // 결과적으로 2차원 배열 형태의 체스 판이 반환됩니다.
    // ex)
    // [
    //  [0,0,0,0],
    //  [0,0,0,0],
    //  [0,0,0,0],
    //  [0,0,0,0]
    // ]
    rows: function () {
      return _(_.range(this.get('n'))).map(function (rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    // 특정 좌표에 말이 없으면 올리고, 이미 있으면 내립니다.
    togglePiece: function (rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    // 특정 좌표가 주어졌을 때, 해당 좌표를 지나는 슬래시 대각선(slash, /)의 첫 번째 행 컬럼을 반환합니다.
    // ex) rowIndex: 1, colIndex: 3이 주어졌을 때 4 반환
    //          0 1 2 3 4 5 6
    // ----------------------   n*2 - 2
    //       0    [0,0,0,0]1
    //       1    [0,0,0,1]
    //       2    [0,0,1,0]
    //       3    [0,1,0,0]
    _getFirstRowColumnIndexForSlashOn: function (rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    // 특정 좌표가 주어졌을 때, 해당 좌표를 지나는 역 슬래시 대각선(backslash, \)의 첫 번째 행 컬럼을 반환합니다.
    // ex) rowIndex: 1, colIndex: 0이 주어졌을 때 -1 반환
    //        -3 -2 -1 0 1 2 3 
    // ----------------------  col(0) - row(1) = result (-1)
    //       0   1[0,0,0,0]
    //       1    [1,0,0,0]
    //       2    [0,1,0,0]
    //       3    [0,0,1,0]
    _getFirstRowColumnIndexForBackSlashOn: function (rowIndex, colIndex) {
      return colIndex - rowIndex; 
    },

    // 체스 판 위에 서로 공격할 수 있는 룩이 한 쌍이라도 있는지 검사합니다.
    hasAnyRooksConflicts: function () {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    // 체스 판 위 특정 좌표를 기준으로, 서로 공격할 수 있는 룩이 한 쌍이라도 있는지 검사합니다. (가로, 세로)
    hasAnyRooksConflictsOn: function (rowIndex, colIndex) {
      return this.hasRowConflictAt(rowIndex) || this.hasColConflictAt(colIndex);
    },

    // 체스 판 위에 서로 공격할 수 있는 퀸이 한 쌍이라도 있는지 검사합니다.
    hasAnyQueensConflicts: function () {
      return (
        this.hasAnyRooksConflicts() ||
        this.hasAnySlashConflicts() ||
        this.hasAnyBackSlashConflicts()
      );
    },

    // 체스 판 위 특정 좌표를 기준으로, 서로 공격할 수 있는 퀸이 한 쌍이라도 있는지 검사합니다. (가로, 세로, 슬래시(/), 역 슬래시(\))
    // 이 함수는 BorderView.js 파일에서 브라우저에 체스판을 그려주기 위해 사용합니다.
    hasAnyQueenConflictsOn: function (rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasSlashConflictAt(
          this._getFirstRowColumnIndexForSlashOn(rowIndex, colIndex)
        ) ||
        this.hasBackSlashConflictAt(
          this._getFirstRowColumnIndexForBackSlashOn(rowIndex, colIndex)
        )
      );
    },

    // 주어진 좌표가 체스 판에 포함되는 좌표인지 확인합니다.
    _isInBounds: function (rowIndex, colIndex) {
      return (
        rowIndex >= 0 &&
        rowIndex < this.get('n') &&
        colIndex >= 0 &&
        colIndex < this.get('n')
      );
    },
    /* eslint-enable */

    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /* =========================================================================
    =                 TODO: fill in these Helper Functions                    =
    ========================================================================= */

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // 주어진 행(rowIndex)에 충돌하는 말이 있는지 확인합니다.
    hasRowConflictAt: function (rowIndex) {
      let board = this.get(rowIndex)
      let count = 0;

      for(let i = 0; i < board.length ; i ++){
        if(board[i] === 1){
          count ++
        }
      }
      if(count > 1){
        return true
      }
      return false; // fixme
    },

    // 체스 판 위에 행 충돌이 하나라도 있는지 검사합니다.
    hasAnyRowConflicts: function () {
    for(let i = 0 ; i < this.get('n'); i++){
     if(this.hasRowConflictAt(i)){
       return true;
     }
    }
      return false; // fixme
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // 주어진 열(colIndex)에 충돌하는 말이 있는지 확인합니다.
    hasColConflictAt: function (colIndex) {
      let count = 0;
      for(let i = 0; i < this.get('n') ; i++){
          if(this.rows()[i][colIndex]===1){
            count++
          }
      }
      if(count > 1){
        return true;
      }
      return false; // fixme
    },

    // 체스 판 위에 열 충돌이 하나라도 있는지 검사합니다.
    hasAnyColConflicts: function () {
      for(let i= 0 ; i < this.get('n');i++){
        if(this.hasColConflictAt(i)){
          return true
        }
      }
      return false; // fixme
    },

    // Slash (/) - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // 주어진 슬래시 대각선(/)에 충돌하는 말이 있는지 확인합니다.
    hasSlashConflictAt: function (SlashColumnIndexAtFirstRow) {
      let count = 0
      for(let i = 0 ; i < this.get('n'); i++){
        let row = i;
        let col = SlashColumnIndexAtFirstRow - row 
        if(this._isInBounds(row,col)){
          if(this.rows()[row][col]===1){
            count++
          }
        }
      } 
      if(count > 1){
        return true; 
      }
      return false; // fixme
    },

    // 체스 판 위에 슬래시 대각선(/)에 충돌이 하나라도 있는지 검사합니다.
    hasAnySlashConflicts: function () {
      for(let i = 0; i<=this.get('n')*2-2; i++){    
        if(this.hasSlashConflictAt(i)){
          return true
        }
      }
      return false; // fixme
    },

    // BackSlash (\) - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // 주어진 역 슬래시 대각선(\)에 충돌하는 말이 있는지 확인합니다.
    hasBackSlashConflictAt: function (BackSlashColumnIndexAtFirstRow) {    
      let count = 0
      for(let i = 0 ; i < this.get('n'); i++){
        let row = i;
        let col = BackSlashColumnIndexAtFirstRow + row 
        if(this._isInBounds(row,col)){
          if(this.rows()[row][col]===1){
            count++
          }
        }
      } 
      if(count > 1){
        return true; 
      }
      return false; // fixme
    },

    // 체스 판 위에 역 슬래시 대각선(\) 충돌이 하나라도 있는지 검사합니다.
    hasAnyBackSlashConflicts: function () {
      for(let i = -(this.get('n')-1); i<=this.get('n')-1; i++){    
        if(this.hasBackSlashConflictAt(i)){
          return true
        }
      } 
      return false; // fixme
    },

    /* --------------------  End of Helper Functions  --------------------- */
  });
  /* eslint-disable */
  const makeEmptyMatrix = function (n) {
    return _(_.range(n)).map(function () {
      return _(_.range(n)).map(function () {
        return 0;
      });
    });
  };
  /* eslint-enable */
})();

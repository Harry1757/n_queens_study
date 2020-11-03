/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting

// n이 주어졌을 때 n rooks 문제의 해답 한 개를 반환합니다.
// 반환 값은 체스 판을 나타내는 2차원 배열입니다.
window.findNRooksSolution = function (n) {
  let board = new Board({ n: n });
  function recursive(row) {
    if (row >= n) {
      return board.rows();
    }
    for (let i = 0; i < board.get('n'); i++) {
      board.togglePiece(row, i);
      if (board.hasAnyRooksConflictsOn(row, i)) {
        board.togglePiece(row, i);
      } else {
        return recursive(row + 1);
      }
    }
  }
  const solution = recursive(0); // fixme
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// n이 주어졌을 때 n rooks 문제의 전체 해답 개수를 반환합니다.
// 반환 값은 정수입니다.
window.countNRooksSolutions = function (n) {
  let solutionCount = undefined; // fixme
  if(n === 1){
    solutionCount = 1
  }else{
    solutionCount = n*countNRooksSolutions(n-1)
  }

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};


// n이 주어졌을 때 n queens 문제의 해답 한 개를 반환합니다.
// 반환 값은 체스 판을 나타내는 2차원 배열입니다.
window.findNQueensSolution = function (n) {
  const solution = undefined; // fixme



  console.log(
    'Single solution for ' + n + ' queens:',
    JSON.stringify(solution)
  );
  return solution;
};

// n이 주어졌을 때 n queens 문제의 전체 해답 개수를 반환합니다.
// 반환 값은 정수입니다.
window.countNQueensSolutions = function (n) {
  let solutionCount = 0; // fixme
  let board = new Board({ n: n });
  const recursive = function (row) {
    if (board.hasAnyQueensConflicts()) {
      return;
    }
    if (row === n) {
      solutionCount++;
      return;
    }
    for (let i = 0; i < n; i++) {
      board.togglePiece(row, i);
      recursive(row + 1);
      board.togglePiece(row, i);
    }
  };
  recursive(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
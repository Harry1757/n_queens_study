describe('Board', function () {
  const capitalize = function (word) {
    return word[0].toUpperCase() + word.slice(1);
  };

  const verifyConflictTypes = function (expectedConflicts, matrix) {
    // The Board() constructor will accept a matrix and build that into a (Backbone) Board object (as defined in Board.js)
    const board = new Board(matrix);
    const conflicts = ['row', 'col', 'rooks', 'slash', 'backSlash', 'queens'];
    conflicts.forEach((cType) => {
      const conflictDetected = board[
        'hasAny' + capitalize(cType) + 'Conflicts'
      ]();
      const conflictExpected = expectedConflicts.includes(cType);

      const message = conflictExpected
        ? `should detect any ${cType} conflicts`
        : `there should be NO ${cType} conflicts`;
      it(message, function () {
        expect(conflictDetected).to.be.equal(conflictExpected);
      });
    });
  };

  describe('Empty board', function () {
    verifyConflictTypes(
      [''],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
    );
  });

  describe('Board with row conflicts', function () {
    verifyConflictTypes(
      ['row', 'rooks', 'queens'],
      [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
    );
  });

  describe('Board with col conflicts', function () {
    verifyConflictTypes(
      ['col', 'rooks', 'queens'],
      [
        [1, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ]
    );
  });

  describe('Board with slash(/) conflicts', function () {
    verifyConflictTypes(
      ['slash', 'queens'],
      [
        [0, 0, 1, 0],
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
      ]
    );

    verifyConflictTypes(
      ['slash', 'queens'],
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
      ]
    );
  });

  describe('Board with backslash(\\) conflicts', function () {
    verifyConflictTypes(
      ['backSlash', 'queens'],
      [
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
    );

    verifyConflictTypes(
      ['backSlash', 'queens'],
      [
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 1, 0],
      ]
    );
  });
});

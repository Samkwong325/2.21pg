const gameBoard = document.getElementById('game-board');
const imageInput = document.getElementById('image-input');

let isDragging = false;
let currentPiece = null;
let currentPosition = { x: 0, y: 0 };

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        createPuzzlePieces(img);
      };
    };
    reader.readAsDataURL(file);
  }
});

gameBoard.addEventListener('mousedown', (event) => {
  const piece = event.target.closest('.puzzle-piece');
  if (piece) {
    isDragging = true;
    currentPiece = piece;
    currentPosition = { x: event.clientX - piece.offsetLeft, y: event.clientY - piece.offsetTop };
    piece.classList.add('dragging');
  }
});

gameBoard.addEventListener('mousemove', (event) => {
  if (isDragging && currentPiece) {
    currentPiece.style.left = `${event.clientX - currentPosition.x}px`;
    currentPiece.style.top = `${event.clientY - currentPosition.y}px`;
  }
});

gameBoard.addEventListener('mouseup', (event) => {
  if (isDragging && currentPiece) {
    isDragging = false;
    currentPiece.classList.remove('dragging');
    currentPiece.style.left = '';
    currentPiece.style.top = '';
    currentPiece.classList.add('dropped');
    currentPiece = null;
  }
});

function createPuzzlePieces(image) {
  gameBoard.innerHTML = '';

  const width = image.width;
  const height = image.height;
  const pieceWidth = width / 2;
  const pieceHeight = height / 2;

  const piecePositions = [
    { x: 0, y: 0 },
    { x: pieceWidth, y: 0 },
    { x: 0, y: pieceHeight },
    { x: pieceWidth, y: pieceHeight },
  ];

  // Shuffle the piece positions
  for (let i = piecePositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [piecePositions[i], piecePositions[j]] = [piecePositions[j], piecePositions[i]];
  }

  piecePositions.forEach((position, index) => {
    const piece = document.createElement('div');
    piece.classList.add('puzzle-piece');
    piece.style.gridColumn = (index % 2) + 1;
    piece.style.gridRow = Math.floor(index / 2) + 1;

    const canvas = document.createElement('canvas');
    canvas.width = pieceWidth;
    canvas.height = pieceHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, position.x, position.y, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
    piece.appendChild(canvas);

    gameBoard.appendChild(piece);
  });
}

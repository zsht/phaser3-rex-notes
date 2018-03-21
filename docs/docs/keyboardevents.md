## Introduction

Built-in keyboard events of phaser.

- Author: Richard Davey

## Usage

### Any key down/up events

```javascript
scene.input.keyboard.on('keydown', function (event) { /* ... */});
scene.input.keyboard.on('keyup', function (event) { /* ... */});
```

### Specific key down/up events

```javascript
scene.input.keyboard.on('keydown_' + 'A', function (event) { /* ... */});
scene.input.keyboard.on('keyup_' + 'A', function (event) { /* ... */});
```

### Get state of specific key

- Get key state object

```javascript
var BKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
```

- Get key state

```javascript
var isDown = BKey.isDown;
var isUp = BKey.isUp;
```

### Get state of cursorkeys

- Get key state object

```javascript
var cursorKeys = scene.input.keyboard.createCursorKeys();
```

- Get key state

```javascript
var isUpDown = cursorKeys.up.isDown;
var isDownDown = cursorKeys.down.isDown;
var isLeftDown = cursorKeys.left.isDown;
var isRightDown = cursorKeys.right.isDown;
var isSpaceDown = cursorKeys.space.isDown;
var isShiftDown = cursorKeys.shift.isDown;
```

### Key map

- `A` ~ `Z`
- `F1` ~ `F12`
- `BACKSPACE`
- `TAB`
- `ENTER`
- `SHIFT`
- `CTRL`. `ALT`
- `PAUSE`
- `CAPS_LOCK`
- `ESC`
- `SPACE`
- `PAGE_UP`, `PAGE_DOWN`
- `END`, `HOME`
- `LEFT`, `UP`, `RIGHT`,`DOWN`
- `PRINT_SCREEN`
- `INSERT`, `DELETE`
- `ZERO`, `ONE`, `TWO`, `THREE`, `FOUR`, `FIVE`, `SIX`, `SEVEN`, `EIGHT`, `NINE`
- `OPEN_BRACKET`, `CLOSED_BRACKET`
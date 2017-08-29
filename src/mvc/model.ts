interface Board {
	board: object;
	width: number;
	height: number;
	boardInit(): any;
	getBoard(): object;
}

interface Cell {
	x: number;
	y: number;
	alive: boolean;
}

export default class Model {
	board: { [index:string] : object };
	width: number;
	height: number;
	
	constructor (width: number, height: number) {
		this.board = {};
		this.width = width;
		this.height = height;
	}
	boardInit ():any {
		let currentCell: Cell;
		this.board = {};
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				currentCell = {
					x: i,
					y: j,
					alive: false
				};
				this.board[getCellRepresentation(i, j)] = currentCell;
			}
		}
	}
	getCellAt (key: string):object {
		return this.board[key];
	}
	getAliveNeighbors (key: string):number {
		let x: any = this.board[key]["x"];
		let y: any = this.board[key]["y"];
		let alive: number = 0;
		let currentCell: object;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (i === 0 && i == j) {
					continue;
				}
				currentCell = this.getCellAt(getCellRepresentation(x + i, y + j));
				if (currentCell && currentCell["alive"]) {
					alive++;
				}
			}
		}
		return alive;
	}
	calculateNextState (key: string):object {
		let cell: object = this.board[key];
		let tempCell: object = {x: this.board[key]["x"], y: this.board[key]["y"], alive: this.board[key]["alive"]};
		let livingNeighbours: number = this.getAliveNeighbors(key);
		if (tempCell["alive"]) {
			if (livingNeighbours == 2 || livingNeighbours == 3) {
				tempCell["alive"] = true;
			} else {
				tempCell["alive"] = false;
			}
		} else {
			if (livingNeighbours == 3) {
				tempCell["alive"] = true;
			}
		}

		return tempCell;
	}
	nextBoardState() {
		let currentBoard: object = this.board;
		let tempBoard = {};
		let key: any;
		for (key in this.board) {
			let currentCell: object = this.board[key];
			let tempCell: object = this.calculateNextState(key);
			tempBoard[key] = tempCell;
		}

		this.board = tempBoard;
	}
	editLifeState(key: any) {
		let cellAlive = this.board[key]["alive"];
		if(cellAlive) {
			this.board[key]["alive"] = false;
		}else {
			this.board[key]["alive"] = true;
		}
	}
	changeWidth(reWidth: number) {
		var temObj = jQuery.extend(true, {}, this.board);
		var temWidth = this.width;

		this.width = reWidth;
		this.boardInit();
		for (let keyy in this.board ) {
			for (let key in temObj) {
				if (keyy == key) {
					this.board[getCellRepresentation(temObj[keyy]["x"], temObj[keyy]["y"])] = temObj[keyy];
				}
			}
		}
	}
	changeHeight(reHeight: number) {
		var temObj = jQuery.extend(true, {}, this.board);
		var temHeight = this.height;
		
		this.height = reHeight;
		this.boardInit();
		for (let keyy in this.board ) {
			for (let key in temObj) {
				if (keyy == key) {
					this.board[getCellRepresentation(temObj[keyy]["x"], temObj[keyy]["y"])] = temObj[keyy];
				}
			}
		}
	}
}

function getCellRepresentation(x: number, y: number):string {
	return 'x' + x + 'y' + y;
}

function objectLength( object: any):number {
	let length: number = 0;
	for( let key in object ) {
	    if( object.hasOwnProperty(key) ) {
	        ++length;
	    }
	}
	return length;
}
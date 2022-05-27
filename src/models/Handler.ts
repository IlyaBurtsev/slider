class Handler {
	private id: number
	private position: number
	private length: number

	public setId(id: number){
		this.id = id;
	}

	public getId(): number {
		return this.id;
	}

	public setPosition(position: number) {
		this.position = position;
	}

	public getPosition(): number {
		return this.position;
	}

	public setLength(length: number) {
		this.length = length;
	}

	public getLiength():number {
		return this.length;
	}
}
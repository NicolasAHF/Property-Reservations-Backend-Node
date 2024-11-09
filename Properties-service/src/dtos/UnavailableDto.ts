
export class UnavailableDto{
    from: Date; 
    to: Date;
    creator: string = ""; 
    propertyId: number = 0;
    constructor(from: Date, to: Date, creator: string, propertyId:number) {
        this.from = from;
        this.to = to;
        this.creator = creator;
        this.propertyId = propertyId;
    }
}
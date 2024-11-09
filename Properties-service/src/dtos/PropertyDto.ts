
export class PropertyDto{
    name: string = ""; 
    adultsQuantity: number = 0; 
    childrenQuantity: number = 0; 
    doubleBeds: number = 0;
    simpleBeds: number = 0;
    ac: boolean = false;
    garaje: boolean = false;
    wifi: boolean;
    type: number = 0;
    beachDistance: number = 0;
    state: string = "";
    balneario: string = "";
    neighborhood: string = "";
    images: string[];
    ownerEmail: string;
    constructor(id: number, name: string, mail: string, adultsQuantity: number,
        childrenQuantity: number, doubleBeds: number, simpleBeds: number,
        ac: boolean, garaje: boolean, type: number, beachDistance: number,
        state: string, balneario: string, neighborhood: string, wifi: boolean, images: string[]) {
        this.name = name;
        this.adultsQuantity = adultsQuantity;
        this.childrenQuantity = childrenQuantity;
        this.simpleBeds = simpleBeds;
        this.ac = ac;
        this.wifi = wifi;
        this.garaje = garaje;
        this.type = type;
        this.beachDistance = beachDistance;
        this.state = state;
        this.balneario = balneario;
        this.neighborhood = neighborhood;
        this.ownerEmail = mail;
        this.images = images;
    }
}
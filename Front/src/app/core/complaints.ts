export class Complaint {
    idcomplaint: number;
    description: string = '';
    title: string = '';
    type = TypeRec.FORUM;
    mail: string = '';
    status: Status = Status.PENDING;
    date: Date;
    isAnonymous: boolean = false; // Ajouter cette propriété
    anonymousId?: string;
    priority: ComplaintPriority = ComplaintPriority.MEDIUM;

    constructor(idcomplaint: number, description: string, title: string, type: TypeRec, mail: string, status: Status, priority: ComplaintPriority, isAnonymous: boolean = false, anonymousId?: string, date?: string) {
        this.idcomplaint = idcomplaint;
        this.description = description;
        this.title = title;
        this.type = type;
        this.mail = mail;
        this.status = status;
        this.isAnonymous = isAnonymous;
        this.anonymousId = anonymousId;
        this.date = date ? new Date(date) : new Date();
        this.priority = priority;
    }
}
export enum ComplaintPriority  {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum TypeRec {
    FORUM = 'FORUM',
    COURS = 'COURS',
    FORMATION = 'FORMATION',
    PFE = 'PFE',
    HACKATHON = 'HACKATHON',
}

export enum Status {
    SOLVED = 'SOLVED',
    DECLINED = 'DECLINED',
    PENDING = 'PENDING'
}

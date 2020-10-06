//Definiendo una interfaz común para los controladores
export interface Controller {
    create?(context: any): Promise<void>;
    update?(context: any): Promise<void>;
    delete?(context: any): Promise<void>;
    read?(context: any): Promise<void>;
};
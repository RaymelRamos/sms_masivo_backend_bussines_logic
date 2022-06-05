import { GroupModel } from "./group-model";

export class SMSModel 
{
    public uuid: string;
    public topic: string;
    public body: string;
    public groups: GroupModel[];
}
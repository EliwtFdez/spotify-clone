export class Artist{
    id: string | undefined;
    constructor(
      public _id: string,
      public name: string,
      public description: string,
      public image: string
    ){}
  }
  
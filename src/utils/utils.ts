export const utils = {
    IsPrimitiveType,
    ConvertPrimitiveTypeToTypeScript,
}

function IsPrimitiveType(property:any):boolean{
    return property.hasOwnProperty("type");
}


function ConvertPrimitiveTypeToTypeScript(propType:string,property:any):string|null{
    switch (propType) {
        case 'float':
        case 'integer':
            return('number');
        case 'array':
            return( `${property.items.type}[]`);
        case 'string':
            return 'string';
        default :
            return null;
    }
}

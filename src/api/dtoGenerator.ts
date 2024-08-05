import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as path from 'path';


class  DtoGenerator{

  private imports : Array<string> = [];

  /**
   * generate the types from an entity
   * @param {string} _dtoName the name of  entity
   * @param {string} schemaInfo the entity
   */
  public generatePropsTypes(_dtoName: string, schemaInfo: any) {
    const enityProperties = schemaInfo.properties;
    const dtoProperties: { propertyName: string; propertyType: string }[] = [];

    for (const prop in enityProperties) {
      if (enityProperties.hasOwnProperty(prop)) {
        const property = enityProperties[prop];
        let propType = property.type;
        if (property.hasOwnProperty("type")) {
          switch (propType) {
            case 'float':
              propType = 'number';
              break;
            case 'integer':
              propType = 'number';
              break;
            case 'array':
              propType = `${property.items.type}[]`;
              break;
            default:
              console.log("default");
              break;
          }
        } else {
          const parts = property['$ref'].split('/');
          const dtoNameForProperty = parts[parts.length - 1];

          if (!this.imports.includes(dtoNameForProperty)) {
            this.imports.push(dtoNameForProperty);
          }

          propType = dtoNameForProperty;
        }
        dtoProperties.push({ propertyName: prop, propertyType: propType });
      }

    }
    return dtoProperties;
  }



  /**
   * generate dtos
   * @param {object} schema the parsed entity
   * @param {string} folderPath the target path where the generated files located
   * @returns
   */
  public generateDtos(schema: any, folderPath: string){
      const dtoTemplate = handlebars.compile(fs.readFileSync(path.join(__dirname, '..', 'src', 'templates', 'dtotemplate.ts.hbs'), 'utf-8'));

      //create target folder
      try {
          fs.mkdirSync(folderPath, { recursive: true });
          console.log(`Created folder: ${folderPath}`);
        } catch (error) {
          console.error(`Error creating folder: ${folderPath}`);
          console.error(error);
          return;
        };

        const generatedDTOs: Set<string> = new Set();
        for (const key in schema){
          if(schema.hasOwnProperty(key) && !generatedDTOs.has(key)){
              const dtoProperties = this.generatePropsTypes(key,schema[key])

              const dtoCodeSnippet = dtoTemplate({
                dtoName: key,
                properties: dtoProperties,
                imports : this.imports,
              });
              const filePath = path.join(folderPath, `${key}.ts`);
              try {
                  fs.writeFileSync(filePath, dtoCodeSnippet);
                  console.log(`Generated DTO file: ${filePath}`);
                  generatedDTOs.add(key);
                } catch (error) {
                  console.error(`Error generating DTO file: ${filePath}`);
                  console.error(error);
                }
          }
        }
  }
}
export default DtoGenerator;

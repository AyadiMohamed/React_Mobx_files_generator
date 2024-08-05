import SwaggerParser from "@apidevtools/swagger-parser";
import { License } from "../models";

class parser {

    private object : any;

    constructor(){
        this.object = null;
    }
    /**
     * parsing the swagger specification using the url passed in the arguments
     * @param {string} url -url of the swagger specification
     */
    public async costumParser(url : string) : Promise<any>{
        try{
            const result = await SwaggerParser.parse(url);
            this.object =  result;
        }
        catch(e : any){
            throw e;
        }
    }
    /**
     * Gets the title of the parsed api
     * @returns {string}
     */
    public async getTitle():Promise<string>{
        try{
            return this.object.info.title;
        }
        catch(e : any){
            throw e;
        }
    }
    /**
     * Gets the description of the parsed api
     * @returns {string}
     */
    public async getDescription():Promise<string>{
        try{
            return this.object.info.description;
        }
        catch(e : any){
            throw e;
        }
    }
    /**
     * Gets the api base path
     * @returns {string}
     */
    public async getBasePath():Promise<string>{
        try{
            return this.object.info.basePath;
        }
        catch(e : any){
            throw e;
        }
    }
    /**
 * Gets the components from the api object based on the specified format ('swagger' or 'openapi').
 * @returns {object} The components from the object.
 * @throws {Error} If the object format is not recognized or if an error occurs during the retrieval.
 */
public async getschemas(): Promise<object> {
    try {
      if (this.object.hasOwnProperty('swagger')) {
        return this.object.definitions;
      } else if (this.object.hasOwnProperty('openapi')) {
        return this.object.components.schemas;
      } else {
        throw new Error('Unrecognized object format. Must have either "swagger" or "openapi" property.');
      }
    } catch (e) {
      throw e;
    }
  }

    /**
 * Gets the paths from the api object parsed from the swagger specification.
 * @returns {object} The paths from the object.
 */
  public async getPaths(): Promise<object> {
    try{
        return this.object.paths;
    }
    catch(e : any){
        throw e;
    }
  }
   /**
 * Gets the tags from the api object parsed from the swagger specification.
 * @returns {object} The tags from the object.
 */
  public async getTags(): Promise<object>{
    try{
        return this.object.tags;
    }
    catch(e : any){
        throw e;
    }
  }
  /**
   * Gets the contact of the api creator
   * @returns {string} The email of the api creator
   */
  public async getApiContact(): Promise<string>{
    try{
        return this.object.info.contact;
    }
    catch(e : any){
        throw e;
    }
  }
  /**
   * Gets name and  url of the api licnese
   * @returns {Array<License>} an array containes the name and the url of the license
   */
  public async getApiLicense(): Promise<Array<License>> {
    let license: License[] = []; // Initialize an empty array

    try {
      let newlicens = new License(this.object.info.license.name,
                                  this.object.info.license.url);
      license.push(newlicens);

      return license;
    } catch (error) {
      throw error;
    }
  }

}



export default parser;

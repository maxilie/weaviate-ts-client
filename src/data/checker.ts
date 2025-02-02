import Connection from '../connection';
import { ObjectsPath } from './path';
import { CommandBase } from '../validation/commandBase';

export default class Checker extends CommandBase {
  private className!: string;
  private id!: string;
  private objectsPath: ObjectsPath;

  constructor(client: Connection, objectsPath: ObjectsPath) {
    super(client);
    this.objectsPath = objectsPath;
  }

  withId = (id: string) => {
    this.id = id;
    return this;
  };

  withClassName = (className: string) => {
    this.className = className;
    return this;
  };

  validateIsSet = (prop: string | undefined | null, name: string, setter: string) => {
    if (prop == undefined || prop == null || prop.length == 0) {
      this.addError(`${name} must be set - set with ${setter}`);
    }
  };

  validateId = () => {
    this.validateIsSet(this.id, 'id', '.withId(id)');
  };

  validate = () => {
    this.validateId();
  };

  do = () => {
    if (this.errors.length > 0) {
      return Promise.reject(new Error('invalid usage: ' + this.errors.join(', ')));
    }
    this.validate();

    return this.objectsPath.buildCheck(this.id, this.className).then((path: string) => {
      return this.client.head(path, undefined);
    });
  };
}

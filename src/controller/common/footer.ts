import { Controller } from "rapin/lib/common";
import Registry from "rapin/lib/engine/registry";

export class ControllerCommonFooter extends Controller {
  public async index() {
    return await this.load.view("common/footer", {});
  }
}

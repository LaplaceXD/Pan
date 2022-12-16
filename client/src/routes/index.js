import postauth from "./postauth";
import preauth from "./preauth";

const routes = Object.freeze([...postauth, ...preauth]);

export default routes;

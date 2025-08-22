import { node } from "./src/core/node.js";
import { router } from "./src/core/router.js";
import { store } from "./src/core/store.js";

node.createApp([store, router])
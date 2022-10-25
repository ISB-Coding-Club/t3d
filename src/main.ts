import init, { start } from "../crates/core/pkg";

const main = async () => {
    await init();
    start();
};

main();

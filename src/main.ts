import "./main.scss";

import init, * as core from "../crates/core/pkg";

const main = () => {
    window.addEventListener("load", async () => {
        await init();

        const renderer = core.init_engine();
    });
};

main();

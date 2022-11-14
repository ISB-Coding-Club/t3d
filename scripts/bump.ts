import fs from "fs";
import path from "path";

export enum VersionBumpType {
    MAJOR,
    MINOR,
    PATCH,
    BETA,
    NONE,
}

export const bumpSemver = (v: string, t: VersionBumpType) => {
    if (t == VersionBumpType.NONE) return v;

    const ver = v.split("-");
    const semver = ver[0].split(".").map((v) => parseInt(v));

    let ver_ = parseInt(ver[1]?.split(".")[1]) || undefined;

    switch (t) {
        case VersionBumpType.MAJOR:
            semver[0] += 1;
            break;

        case VersionBumpType.MINOR:
            semver[1] += 1;
            break;

        case VersionBumpType.PATCH:
            semver[2] += 1;
            break;

        case VersionBumpType.BETA:
            if (ver_) ver_ += 1;
            break;
    }

    const build1 = ver_ ? ver[1]?.split(".")[0] + "." + ver_ : "";
    const build2 = semver.join(".");

    return build2 + "-" + build1;
};

export const getType = () => {
    const type = process.env.TYPE || process.argv[2];
    if (!type) return undefined;

    let _type = VersionBumpType.NONE;

    switch (type.toLowerCase()) {
        case "major":
            _type = VersionBumpType.MAJOR;
            break;

        case "minor":
            _type = VersionBumpType.MINOR;
            break;

        case "patch":
            _type = VersionBumpType.PATCH;
            break;

        case "beta":
            _type = VersionBumpType.BETA;
            break;

        case "none":
            _type = VersionBumpType.NONE;
            break;
    }

    return _type;
};

export const run = () => {
    const appsBase = path.join(__dirname, "..", "apps");
    const packagesBase = path.join(__dirname, "..", "packages");

    const apps = fs
        .readdirSync(appsBase)
        .filter((f) => {
            const folder = path.join(appsBase, f);
            return fs.statSync(folder).isDirectory();
        })
        .map((f) => path.join(appsBase, f));

    const packages = fs
        .readdirSync(packagesBase)
        .filter((f) => {
            const folder = path.join(packagesBase, f);
            return fs.statSync(folder).isDirectory();
        })
        .map((f) => path.join(packagesBase, f));

    const folders = apps.concat(packages);
    const files = folders.map((folder) => path.join(folder, "package.json"));

    const versions: Record<string, string> = {};

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(file, "utf-8").toString());

        versions[file] = data.version;
    }

    if (getType() == undefined) {
        console.log("Please provide a type!");
        process.exit(1);
    }

    for (const file of files) {
        versions[file] = bumpSemver(versions[file], getType()!);
    }

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(file, "utf-8").toString());
        data.version = versions[file];

        fs.writeFileSync(file, JSON.stringify(data, null, 4));

        console.log("Wrote: " + file + "!");
    }

    console.log("Done!");
};

run();

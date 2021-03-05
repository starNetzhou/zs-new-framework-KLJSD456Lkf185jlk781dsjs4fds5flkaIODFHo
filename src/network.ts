export default class network {
    static loadAd() {
        return new Promise((resolve, reject) => {
            zs.exporter.dataMgr.load()
                .then((result) => {
                    resolve(result);
                });
        });
    }
}
sap.ui.define([
    "sap/ui/core/UIComponent",
    "zmesconfrouter/zmesconfrouter/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("zmesconfrouter.zmesconfrouter.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            UIComponent.prototype.init.apply(this, arguments);
            this.setModel(models.createDeviceModel(), "device");
            this._route();
        },

        _route() {
            console.log("[ZMES_CONF_ROUTER] _route start");

            const oModel = this.getModel();
            const sServiceUrl = oModel.sServiceUrl
                || this.getMetadata().getManifestEntry("/sap.app/dataSources/mainService/uri");
            const sUrl = sServiceUrl + "SessionRouter/SAP__self.GetConfRouterTarget()";

            fetch(sUrl, {
                method: "GET",
                headers: { "Accept": "application/json" },
                credentials: "same-origin"
            })
                .then((oResponse) => {
                    if (!oResponse.ok) {
                        throw new Error("HTTP " + oResponse.status);
                    }
                    return oResponse.json();
                })
                .then((oResult) => {
                    console.log("[ZMES_CONF_ROUTER] GetConfRouterTarget result:", oResult);

                    if (!oResult || !oResult.SemObjTo) {
                        console.log("[ZMES_CONF_ROUTER] nincs egyezés, vissza az előző appra");
                        return this._goBack();
                    }

                    return sap.ushell.Container.getServiceAsync("CrossApplicationNavigation")
                        .then((oCrossAppNav) => oCrossAppNav.hrefForExternal({
                            target: {
                                semanticObject: oResult.SemObjTo,
                                action: oResult.SemActTo
                            }
                        }))
                        .then((sHash) => {
                            console.log("[ZMES_CONF_ROUTER] resolved hash:", sHash);
                            window.location.replace(sHash);
                        });
                })
                .catch((oError) => {
                    console.error("[ZMES_CONF_ROUTER] GetConfRouterTarget hívás sikertelen:", oError);
                    this._goBack();
                });
        },

        _goBack() {
            console.log("[ZMES_CONF_ROUTER] _goBack hívva");
            window.history.back();
        }
    });
});
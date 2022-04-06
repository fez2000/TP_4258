/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env browser */

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
function getCookie(cname, cookie) {
    const decodedCookie = cookie || "";
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(`${encodeURIComponent(cname)}=`) == 0) {
            return decodeURIComponent(
                c.substring(`${encodeURIComponent(cname)}=`.length, c.length)
            );
        }
    }
    return "";
}
if ("serviceWorker" in navigator) {
    // Your service-worker.js *must* be located at the top-level directory relative to your site.
    // It won't be able to control pages unless it's located at the same level or higher than them.
    // *Don't* register service worker file in, e.g., a scripts/ sub-directory!
    // See https://github.com/slightlyoff/ServiceWorker/issues/468
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(reg => {
                if ("PushManager" in window) {
                    reg.pushManager
                        .getSubscription()
                        .then(async sub => {
                            if (sub) {
                                return sub;
                            }
                            const response = await fetch(
                                "/api/pushNotification/vapidPublicKey"
                            );
                            const vapidPublicKey = await response.text();
                            const convertedVapidKey = urlBase64ToUint8Array(
                                vapidPublicKey
                            );

                            return reg.pushManager.subscribe({
                                userVisibleOnly: true,
                                applicationServerKey: convertedVapidKey
                            });
                        })
                        .then(subscription => {
                            fetch("/api/pushNotification/register", {
                                method: "post",
                                headers: {
                                    "Content-type": "application/json",
                                    "CSRF-Token": getCookie(
                                        "XSRF-TOKEN",
                                        document.cookie
                                    )
                                },
                                body: JSON.stringify({
                                    subscription
                                })
                            });
                        });
                }
            })
            .catch(registrationError => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}

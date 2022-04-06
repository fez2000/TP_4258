<template>
    <md-dialog
        :md-active.sync="dialogToggle"
        :md-click-outside-to-close="true"
        :md-close-on-esc="false"
        md-dynamic-height
    >
        <v-card max-height="500px" style="overflow: auto;">
            <form
                id="donations"
                target="monetbil-payment-widget-292"
                data-monetbil="form"
                action="https://www.monetbil.ci/pay/v2.1/Kyps4NbLVixgF18dWbGlYGkF4bH1aZuT"
                method="get"
            >
                <input type="text" hidden name="amount" v-model="amount" />
                <input
                    type="text"
                    hidden
                    name="first_name"
                    v-model="first_name"
                />
                <input
                    type="text"
                    hidden
                    name="last_name"
                    v-model="last_name"
                />
                <input type="text" hidden name="email" v-model="email" />
                <input type="text" hidden name="phone" v-model="phone" />
                <input type="text" hidden name="currency" value="XAF" />
            </form>
            <v-card-title>Faire un don</v-card-title>

            <v-card-text>
                Ce don nous aideras beaucoup pour faire evoluer les choses.
                <span v-if="project"
                    >Merci d'avance pour votre contribution pour le project
                    {{ project.name }}</span
                >
            </v-card-text>
            <v-card-text>
                <v-row v-show="e1 == 1">
                    <v-col>
                        <v-text-field
                            label="Montant "
                            v-model="amount"
                            single-line
                            solo
                            suffix="XAF"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row v-show="e1 == 3 && mobile">
                    <v-col>
                        <v-text-field
                            label="Numero "
                            v-model="phone"
                            :single-line="false"
                            solo
                            prefix="+237"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row v-show="e1 == 2">
                    <v-col>
                        <v-btn
                            @click="
                                e1 = 3;
                                mobile = true;
                            "
                            >continuer par mobile</v-btn
                        >
                    </v-col>
                </v-row>
                <v-row v-show="e1 == 2">
                    <v-col>
                        <div id="pb1"></div>
                    </v-col>
                </v-row>
                <v-text-field
                    label="Nom"
                    v-model="first_name"
                    v-show="e1 == 4 && mobile"
                    single-line
                    solo
                ></v-text-field>
                <v-text-field
                    label="Prenom"
                    v-model="last_name"
                    v-show="e1 == 4 && mobile"
                    single-line
                    solo
                ></v-text-field>
                <v-text-field
                    label="Email"
                    v-model="email"
                    v-show="e1 == 4 && mobile"
                    single-line
                    solo
                ></v-text-field>
            </v-card-text>

            <v-card-actions>
                <v-btn text v-if="e1 > 1" @click="e1--">Precedent</v-btn>
                <v-spacer></v-spacer>

                <v-btn
                    color="blue darken-1"
                    :disabled="
                        (e1 == 1 && parseFloat(amount) == 'NaN') ||
                            (e1 == 1 && !amount) ||
                            (e1 == 3 && parseInt(phone) == 'NaN') ||
                                (e1 == 3 && !phone)
                    "
                    text
                    @click="e1++"
                    v-show="e1 == 1 || e1 == 3"
                    >Suivant</v-btn
                >
                <v-btn
                    color="blue darken-1"
                    v-show="e1 == 4"
                    text
                    @click="donate"
                    >Payer</v-btn
                >
            </v-card-actions>
        </v-card>
    </md-dialog>
</template>

<script>
export default {
    methods: {
        donate() {
            this.dialogToggle = false;
            document.getElementById("donations").submit();
        },
        init() {
            try {
                paypal
                    .Buttons({
                        createOrder: () => {
                            return this.$axios
                                .post(
                                    "/api/create-paypal-transaction",
                                    { amount: this.amount },
                                    {
                                        headers: {
                                            "CSRF-Token": this.$Cookies.get(
                                                "XSRF-TOKEN"
                                            )
                                        }
                                    }
                                )
                                .then(function(res) {
                                    return res.data;
                                })
                                .then(function(data) {
                                    return data.orderID; // Use the same key name for order ID on the client and server
                                });
                        },
                        onApprove: (data, actions) => {
                            this.dialogToggle = false;
                            return fetch(
                                "/my-server/handle-approve/" + data.orderID,
                                {
                                    method: "GET"
                                }
                            ).then(function(res) {
                                if (!res.ok) {
                                    alert("Something went wrong");
                                }
                            });
                        }
                    })
                    .render("#pb1");
            } catch (err) {
                console.log(err);
            }
        },
        nextStep(n) {
            if (n === 2) {
                this.e1 = 2;
            } else {
                this.e1 = n + 1;
            }
        }
    },
    mounted() {},
    computed: {},
    watch: {
        dialog() {
            this.dialogToggle = true;
            this.e1 = 1;
            this.amount = 1000;
            this.mobile = false;
            try {
                setTimeout(this.init, 200);
            } catch (err) {
                this.$root.$emit("snackbar", {
                    display: true,
                    text:
                        "Please check your internet dat connection then reload this page"
                });
            }
        }
    },
    data() {
        return {
            e1: 1,
            mobile: true,
            dialogToggle: false,
            amount: 1000,
            first_name: "",
            last_name: "",
            email: "",
            phone: "Numero"
        };
    },
    props: {
        dialog: {
            type: Boolean,
            default: false
        },
        project: {}
    }
};
</script>

<style></style>

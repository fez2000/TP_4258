
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
                target="paymooney"
                data-monetbil="form"
                action="https://www.paymooney.com/api/v1.0/payment_url"
                @submit="submit"
                enctype="application/x-www-form-urlencoded"
                method="POST"
            >
                <input type="text" hidden name="amount" :value="amount" />
                <input type="text" hidden name="first_name" v-model="first_name"/>
                <input type="text" hidden name="last_name" v-model="last_name" />
                <input type="text" hidden name="email" v-model="email" />

                <input type="text"  hidden name="phone" v-model="number"/>
                <input type="text" hidden name="currency_code" v-model="currency" value="XAF" />
                <input type="text" hidden name="item_ref" v-model="item_ref" />
                <input type="text" hidden name="item_name" v-model="item_name" />
                <input type="text" hidden name="description" v-model="item_description" />
                <input type="text" hidden name="public_key" v-model="public_key" />
                <input type="text" hidden name="environement" v-model="environement"/>
                <input type="text" hidden name="ccode" v-model="ccode"/>
                <input type="text" hidden name="lang" value="fr"/>
                <input type="text" hidden name="logo" value="https://jesusking.me/img/jk_logo.png"/>
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
                            :suffix="currency"
                        ></v-text-field>
                        <v-select
                        :items="items"
                        v-model="currency"
                        label="Standard"
                        chips
                        solo
                        single-line
                        ></v-select>
                    </v-col>
                </v-row>

                <v-row v-show="e1 == 2">
                    <v-col>

                        <vue-tel-input required mode="international" @validate="v" @input="updateV" @country-changed="updatePhone" v-model="phone"></vue-tel-input>
                    </v-col>
                </v-row>

                <v-text-field
                    label="Nom"
                    v-model="first_name"
                    v-show="e1 == 3"
                    single-line
                    solo
                ></v-text-field>
                <v-text-field
                    label="Prenom"
                    v-model="last_name"
                    v-show="e1 == 3"
                    single-line
                    solo
                ></v-text-field>
                <v-text-field
                    label="Email"
                    v-model="email"
                    v-show="e1 == 3"
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
                            (e1 == 2 && !isValid)
                    "
                    text
                    @click="e1++"
                    v-show="e1 == 1 || e1 == 2 "
                    >Suivant</v-btn
                >
                <v-btn
                    color="blue darken-1"
                    v-show="e1 == 3"
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
        donate(e) {
            this.dialogToggle = false;
            document.getElementById("donations").submit(e);
            this.submit()
        },
        nextStep(n) {
            if (n === 2) {
                this.e1 = 2;
            } else {
                this.e1 = n + 1;
            }
        },
        updatePhone(v){
            this.ccode = v.iso2;

        },
        updateV(infos){
            this.country = infos.country;
            this.isValid = infos.isValid;

        },
        v(info){
            this.isValid = info.isValid;
            this.number = info.number.e164;
            this.ccode = info.country.iso2;
        },
        submit(){
            const { ccode, amount, first_name, last_name, item_description, item_ref, number, public_key, email, lang , environement } = this.$data;
            let formData = new FormData(), data = {
                ccode,amount: ''+amount, first_name, last_name, "description":item_description, item_ref: ''+item_ref, "phone":number, public_key, email, lang , environement
            };
            let r = '', i = -1;
            for(let v in data){
                r+=( i!= -1?'&':'' +`data[${v}]=${data[v]}`)
                formData.append(`data[${v}]`, data[v]);
            }
            this.$axios.post("https://www.paymooney.com/api/v1.0/payment_url", r, {
                mode: 'no-cors',
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                     'Access-Control-Allow-Origin': '*',
                }
            }).then(console.log)
            console.log("sub")
        }
    },
    mounted() {},
    computed: {

    },
    watch: {
        dialog() {

            this.dialogToggle = true;
            this.e1 = 1;
            this.amount = 1000;
            this.item_description = "Ce don nous aideras beaucoup pour faire evoluer les choses.";
            if(this.project){
                this.item_ref = this.project._id;

                this.item_description += `Merci d'avance pour votre contribution pour le project ${this.project.name}`;

            }
        },

    },
    data() {
        return {
            e1: 1,
            ccode: 'CM',
            country: 'CM',
            dialogToggle: false,
            amount: 1000,
            first_name: "",
            last_name: "",
            item_description: "",
            item_ref: '08',
            number: '',
            items:['XAF','USD'],
            currency: "XAF",
            isValid: false,
            item_name: "Donation",
            public_key: process.env.PAY_MON_PUBLIC_KEY,
            email: "",
            lang: "fr",
            phone: "",
            environement: "test"
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

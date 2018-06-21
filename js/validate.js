'use strict';

;(function () {

    //class validate - take string
    class Validate{
        constructor(form_name, config){
            this.form = document.forms[form_name];// form
            this.form_inputs = [].slice.call(this.form.elements); // transform to array
            this.inputs_required = this.form_inputs.filter( input => input.dataset.required );// dataset - base of atributes with data-...
            this.sending_data = {}; //empty object for saving inputs
            this.checkbox_stay_logged_in = this.form.elements['stay-logged-in'];
            this.sending_config = config;
            this.error_block = document.querySelector('.error-info');// bootstrap error block
            this.form_valid_toggle = true;

        }
        init(){
            let self = this;

            this.events(self);
        }

        events(self){
            this.form.addEventListener('submit', (e) => {

                e.preventDefault();// stop refresh page

               this.form_valid_toggle = this.inputs_required.every( input => { // put into switch toggle( true or false)
                    let regExp = new RegExp( input.dataset.required, 'g' ); // regular text - changed on red color
                    let value = input.value; // strings in forms when doing submit

                    this.sending_data[input.name] = value;// we have the same name in html (name="password")

                    return regExp.test(value)// true or false
                    // console.log(regExp.test(value));// special method for regular expr
                });
                // console.log(this.form_valid_toggle);
                if( !this.form_valid_toggle ) return this.show_error('Incorrect email or password');// if right -> send form

                this.send_form();



            })
        }

        send_form(){
            console.log('send form...', this.sending_data);
            let xhr = new XMLHttpRequest();
            xhr.timeout = 10000;

            xhr.open(this.sending_config.method, this.sending_config.url );//method, url, async(boolean)

            xhr.setRequestHeader('Content-Type', 'application/json');// for parsing, headers

            xhr.send(JSON.stringify(this.sending_data));

            xhr.addEventListener('load', () => {  // answer from server
                if ( xhr.status === 200 ){   // response answer tokens if true
                    this.handler_on_success(xhr.responseText);
                } else if ( xhr.status === 404 ) {
                    this.show_error(xhr.responseText);
                }
            })
            xhr.addEventListener('timeout', () => {
                console.log('error connect');//
            })
        }

        show_error(err){
            console.log(err);
            this.sending_data = {}; // clean object if false (inputs)
            this.error_block.innerHTML = err;// write a text into block (incorrect....)
            this.error_block.classList.add('show');//add a class into css code to show

        }

        handler_on_success(res) {
            if (this.checkbox_stay_logged_in.checked) { // checked - check true or false
                localStorage.setItem('token', res); // res - answer from server
            } else {
                sessionStorage.setItem('token', res);
            }
        }

    }

    let login_form = new Validate('login-form', { // name of html form
        method: 'POST',
        url: 'https://easycode-test-auth-server.herokuapp.com/login'// into config
    });
    login_form.init();
})();

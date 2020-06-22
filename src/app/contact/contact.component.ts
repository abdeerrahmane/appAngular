import { Component, OnInit, ViewChild ,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';

import { Feedback, ContactType } from '../shared/feedback';
import { FebackService } from '../services/feback.service';
import { flyInOut, expand  } from '../animations/app.animation';

import { visibility } from '../animations/app.animation';

 

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    visibility(),        
    expand()
  ]
})
export class ContactComponent implements OnInit {
  @ViewChild('fform') feedbackFormDirective;

  feedbackForm: FormGroup;
  feedback: Feedback;
  feedbacks : Feedback[] ; 
  erorMess : string ; 
  contactType = ContactType;
  visibility = 'shown';
  progress  : boolean  ;
  progress1 : boolean ;

  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  constructor(  private fb: FormBuilder ,
                private servi : FebackService ,
                @Inject('baseURL') private baseURL ,
             
                private route: ActivatedRoute
              ) {
    this.createForm();
    this.progress=false;
    this.progress1=false
  }

  ngOnInit() {
    this.servi.getFedbacks().subscribe((feedbacks) => this.feedbacks = feedbacks , errmess => this.erorMess = <any>errmess);
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  }

  onSubmit() {
    this.progress=true;
    this.feedback = this.feedbackForm.value;
    this.visibility = 'hidden';

    this.servi.addFedback(this.feedback)
    .subscribe( 
                feedback =>{
                  this.feedbacks.push(this.feedback);
                  this.feedback = feedback;
                  this.progress=false;
                  this.progress1=true;
                  setTimeout(()=>{
                    this.progress1=false ; 
                    this.visibility='shown';
                  } , 5000);
                
                   } 
                 );
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }
  
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}

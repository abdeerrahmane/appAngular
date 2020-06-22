import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ViewChild } from '@angular/core';

import { Comment} from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { visibility } from '../animations/app.animation';
import { flyInOut, expand  } from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {
  @ViewChild('cform') commentFormDirective;

  o : Comment ; 
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  forAbdo: FormGroup;
  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';
  Ferrors = {
    'name': '',
    'commentaire': '',
    'star': ''
  };
  validationMessages = {
    'name': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      
    },
    'commentaire': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
    }
   
  };
  constructor(private dishservice: DishService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private location: Location , 
              @Inject('baseURL') private baseURL
              ) {
                  this.createForm();
                }


  ngOnInit() {
                this.dishservice.getDishIds()
                .subscribe(dishIds => this.dishIds = dishIds,
                errmess => this.errMess = <any>errmess);
                this.route.params
                .pipe(switchMap((params: Params) => {
                                                      this.visibility= 'hidden'; 
                                                      return this.dishservice.getDish(+params['id']);
                                                     }))
                .subscribe(dish => {
                                    this.dish = dish;
                                    this.dishcopy = dish;
                                    this.setPrevNext(dish.id); 
                                    this.visibility = 'shown'; 
                                   },
                                    errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void {
    this.location.back();
  }
  createForm() {
    this.forAbdo = this.fb.group({
      name:['' , [Validators.required, Validators.minLength(2)] ],
      commentaire: ['',[Validators.required, Validators.minLength(2)]],
      star: 0,
    });
    this.forAbdo.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  
  onValider() {
    this.o = this.forAbdo.value;
    this.o.comment = this.forAbdo.value.commentaire;
    this.o.author = this.forAbdo.value.name ;
    this.o.rating = this.forAbdo.value.star ;
    this.o.date = new Date().toString();
    
    this.dishcopy.comments.push(this.o);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
          this.dishcopy = dish;
      },
      errmess => {
                   this.dish = null; 
                   this.dishcopy = null; 
                   this.errMess = <any>errmess; 
                  });
      
    console.log(this.o);
    this.forAbdo.reset({
      name: '',
      commentaire: '',
      star: '' 
    });
    this.commentFormDirective.resetForm({rating: 5});
    
  } 
 
  
  onValueChanged(data?: any) {
    if (!this.forAbdo) { return; }
    const form = this.forAbdo;
    for (const field in this.Ferrors) {
      if (this.Ferrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.Ferrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.Ferrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
 
}
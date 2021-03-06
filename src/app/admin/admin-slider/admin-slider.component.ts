import { Component, OnInit } from '@angular/core';
import { SlidesService } from '../../services/slides.service';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-slider',
  templateUrl: './admin-slider.component.html',
  styleUrls: ['./admin-slider.component.css']
})
export class AdminSliderComponent implements OnInit {

  slideList: Observable<any[]>;  
  percentage: Observable<number>;

  constructor(private slidesService: SlidesService) { 
    this.slideList = this.slidesService.getSlides()
      .snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ $key: c.payload.key, ...c.payload.val() }))
        )
      );     
    //this.percentage = this.slidesService.getPercentage();  
  }

  ngOnInit() {
  }

  onSubmitMedia(inp : any, type: string, form?: NgForm){    
    let task = this.slidesService.insertMediaSlide(inp.files, type, form.value);      
    //Porcentaje
    this.percentage = task.percentageChanges();
    //Reset    
    if(form) this.resetForm(form);          
    inp.value = "";
  }

  onSubmitTexto(form: NgForm){    
    form.value['tipo']='texto';
    this.slidesService.insertNoMediaSlide(form.value);
    this.resetForm(form);
  }


  /*
  onSubmitImagen(element, url) { 
    this.slidesService.insertSlide({
      tipo: 'imagen',
      url: url
    });
    element.value = ""; //Reset
    this.percentage = null;
  }
  onSubmitTexto(form : NgForm){    
    form.value['tipo'] = "texto";
    this.slidesService.insertSlide(form.value);    
    this.resetForm(form);
  }
  onSubmitVideo(element, url, tipo) { 
    console.log('Video Type: ',tipo);    
    this.slidesService.insertSlide({
      tipo: 'video',
      url: url,
      mediatype: tipo
    });
    element.value = ""; //Reset
    this.percentage = null;
  }
*/
  resetForm(form : NgForm){
    if(form != null)
      form.reset();
    //this.redesService.selectedRed = new Red();
  }

  onDelete(slide: any){
    if(confirm('¿Estas seguro que deseas elimiar este slide?')) {
      this.slidesService.deleteSlide(slide);
    }
  }

}

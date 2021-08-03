import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadosService } from './services/estados/estados.service';
import { PaisesService } from './services/paises/paises.service';
import { PersonaService } from './services/persona/persona.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {//aqui implementamos la interfaz oninit
  


  personaForm: FormGroup;
  paises: any;
  estados: any;
  personas: any;


  constructor(
    public fb: FormBuilder,
    public estadosService: EstadosService,
    public paisesService: PaisesService,
    public personaService: PersonaService
  ) {

  }
  ngOnInit(): void {

    this.personaForm = this.fb.group({
      id: [''], //esto indica que el id no es requerido se usa para el metodo editar 
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', Validators.required],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
    });;
    //este metodo sirve para traer los paises
    this.paisesService.getAllPaises().subscribe(resp => {
      this.paises = resp;
    },
      error => { console.error(error) }
    );

    //este metodo sierve para traer las personas 
    this.personaService.getAllPersonas().subscribe(resp => {
      this.personas = resp;
    },
      error => { console.error(error) }
    );


    //este metodo trae los estados dependiendo de los paises
    this.personaForm.get('pais').valueChanges.subscribe(value => {
      this.estadosService.getAllEstadosByPais(value.id).subscribe(resp => {
        this.estados = resp;
        //console.log(resp);
      },
        error => { console.error(error) }
      );
    })

  }

  //este es el metodo guardar para el boton que esta en html el cual se llama a traves de (ngSubmit)="guardar()"
  guardar(): void {
    this.personaService.savePersona(this.personaForm.value).subscribe(resp => {
      this.personaForm.reset();//esto es para vaciar el formulario
      this.personas=this.personas.filter(persona=> resp.id!==persona.id); //esto filtra las personas que ya estan y la nuevas basandose en el id
      this.personas.push(resp);//esto es para enviar el formulario la persona 
    },
      error => { console.error(error) }
    )
  }
  
 
  eliminar(persona){
    this.personaService.deletePersona(persona.id).subscribe(resp=>{
      if(resp===true){
        this.personas.pop(persona)
      }
    })
  }

  editar(persona){
    this.personaForm.setValue({
     id:persona.id, //se le da el mismo id que tenia el resto si se puede editar
     nombre:persona.nombre,
     apellido: persona.apellido,
     edad: persona.edad,
     pais: persona.pais,
     estado: persona.estado,

    })
  }



}

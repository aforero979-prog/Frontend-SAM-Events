import { Component, inject, OnInit } from '@angular/core'; 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router'; 
import { HttpPost } from '../../../core/services/http-post'; 
import { HttpAuth } from '../../../core/services/http-auth'; 

const POST_TYPES = ['general', 'evento', 'banda', 'noticia'];

@Component({
  selector: 'app-post-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './post-edit-form.html',
  styleUrl: './post-edit-form.css',
})
export default class PostEditForm implements OnInit {

  private httpPost = inject(HttpPost);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private httpAuth = inject(HttpAuth);

  postTypes = POST_TYPES;

  successMsg = '';
  errorMsg = '';

  formData: FormGroup;
  selectedFile: File | null = null;
  postId: string | null = null;

  constructor() {
    this.formData = new FormGroup({
      title:    new FormControl('', [Validators.required, Validators.minLength(3)]),
      content:  new FormControl('', [Validators.required]),
      imageUrl: new FormControl(''),
      type:     new FormControl('general', [Validators.required]),
      author:   new FormControl(''),
      isActive: new FormControl(true),
    });
  }

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      this.httpPost.getPostById(this.postId).subscribe({
        next: (data: any) => {
          const post = data?.data || data;
          if (post) {
            this.formData.patchValue({
              title: post.title,
              content: post.content,
              imageUrl: post.imageUrl,
              type: post.type,
              author: post.author,
              isActive: post.isActive
            });
          }
        },
        error: (err) => {
          console.error('Error cargando el post', err);
          this.errorMsg = 'Error al cargar los datos del post';
        }
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.formData.valid && this.postId) {
      let payload = { ...this.formData.value };

      if (!payload.author) {
        payload.author = '000000000000000000000000';
      }

      if (this.selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          payload.imageUrl = reader.result as string;
          this.sendData(payload);
        };
        reader.onerror = (error) => {
          console.error('Error leyendo archivo:', error);
          this.sendData(payload);
        };
      } else {
        this.sendData(payload);
      }
    } else {
      console.log('El formulario no es valido o no hay ID');
    }
  }

  sendData(payload: any) {
    this.httpPost.updatePost(this.postId!, payload).subscribe({
      next: (res) => {
        this.successMsg = 'Publicación actualizada correctamente';
        this.errorMsg = '';
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard/posts');
        }, 1500);
      },
      error: (error) => {
        console.error(error);
        this.errorMsg = error.error?.msg || 'Error al actualizar la publicación';
        this.successMsg = '';
      }
    });
  }

  get title() { return this.formData.get('title'); }
  get content() { return this.formData.get('content'); }
  get imageUrl() { return this.formData.get('imageUrl'); }
  get type() { return this.formData.get('type'); }
  get author() { return this.formData.get('author'); }
  get isActive() { return this.formData.get('isActive'); }
}

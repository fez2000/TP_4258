
import i18n from '@/plugins/i18n';

export  const defaultGradient = "to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)";
export  const dragoverGradient = "to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)";
  export  function addFile (e,r) {

    let droppedFiles = r.dataTransfer.files;
    if(!droppedFiles || e.mode == 'preview') return;

    const isImage = /^image\/*/.test(droppedFiles[0].type);

    if(isImage){
      if(droppedFiles[0].size > this.fileMaxSize){

        parent.$root.$emit('snackbar',{display: true, text: 'Project image size should be less than 10 MB!.'});
        return;
      }


      e.file(droppedFiles[0]);
    }else{
      this.$root.$emit('snackbar',{display: true, text: 'Pleace Enter a valid image.'});
    }

  }
  export function dragleave() {
    this.gradient = defaultGradient;
  }
  export function dragover() {
    if(this.mode == 'edit') {
      this.gradient = dragoverGradient;
    }
  }
  export  function clear () {
    this.form.name = this.name;
    this.form.short_description = this.short_description;
    this.form.description = this.description;
    this.form.cathegories = [];
    this.form.valid = true;
    this.form.submitting = false;
    this.form.submitErrors = '';
    if(this.image){
      this.form.src = this.image.src;
    }
    for(let i of this.cathegories){
      this.form.cathegories.push(i._id);
    }
  }
  export  function localUpdate() {
    this.name = this.form.name;
    this.short_description = this.form.short_description;
    this.description = this.form.description;
    this.cathegories = this.form.cathegories;
  }

  export  function editImg(id){
    let input = document.getElementById(id);
    if(input)input.click();
  }
  export  function checkDoc(p,e){
    if(!e.target.files)return;
    for(const file of e.target.files){
      if (e.target.files[0].size > this.fileMaxSize){
        alert('Project image size should be less than 10 MB!.');
        continue;
      }
      p.sendDoc(file);
    }
  }
  export  function checkFile(p,e) {
    p.form.loading = true;
    if (e.target.files[0]){
      if (e.target.files[0].size > this.fileMaxSize){
        alert('Project image size should be less than 10 MB!.');
        return;
      }
      if (!e.target.files) return;
      
     p.file(e.target.files[0]);

    }else{
      p.form.loading = false;
    }

  }
  export  function supDoc(e,doc){

    this.$axios.delete(`/api/project/doc/${e._id}/${doc._id}`,
    {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
      },

    })
    .then(({data})=>{

      if(data.status){
        let docs = [];
        for(let document of e.docs){
          if(document._id == doc._id){
            continue;
          }
          docs.push(document);
        }
        e.docs = docs;
        //this.$router.push('/dashboard/projects');
      }else{
        this.$root.$emit('snackbar', {
          display: true,
          text: JSON.stringify(data.errors)
        });
      }
    }).catch(err=>{

      this.$root.$emit('snackbar', {
        display: true,
        text: JSON.stringify(err)
      });

    })
  }
  export  function updateProjectDoc(e,id){
    this.$axios.post(`/api/project/doc/${e._id}`,
    { _id: id },
    {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
      },

    })
    .then(({data})=>{

      if(data.status){

        //this.$router.push('/dashboard/projects');
      }else{
        this.$root.$emit('snackbar', {
          display: true,
          text: JSON.stringify(data.errors)
        });
      }
    }).catch(err=>{

      this.$root.$emit('snackbar', {
        display: true,
        text: JSON.stringify(err)
      });
      this.$root.$emit('neterror', { err: err, callback: e.updateProjectDoc, data: { id: id } });
    })
  }
  export  function updateImgRef(e,docId, projectId){
    this.$axios.get( `/api/project/${projectId}/${docId}`)
    .then(({data})=>{

      if(data.status){
        e.form.submitting = false;
        e.mode = 'preview';

        this.$root.$emit('snackbar', {
          display: true,
          text: i18n.tc(`fonctions.projetUpdate`)
        });
        //this.$router.push('/dashboard/projects');
      }else{
        this.$root.$emit('snackbar', {
          display: true,
          text: JSON.stringify(data.errors)
        });
      }
    }).catch(err=>{
      e.form.submitErrors = JSON.stringify(err);
      this.$root.$emit('snackbar', {
        display: true
      });
      this.$root.$emit('neterror', { err: err, callback: e.updateImgRef, data: { docId, projectId } });
    })
  }
  export  function sendToValidation(e){
     e.form.submitting = true;

    this.$axios.get('/api/project/submit/'+e._id)
    .then(({data})=>{

      if(data.status){
        e.form.submitting = false;
        e.hidden = true;
        this.$root.$emit('snackbar',{
          display: true,
          text:i18n.tc(`fonctions.projetSubmit`),
        })
      }else{
        e.form.submitErrors =  JSON.stringify(data.errors);
        this.$root.$emit('snackbar',{
          display: true,
          text: JSON.stringify(data.errors),
        })


      }
    }).catch(err=>{

          //e.form.submitting = false;
            this.$root.$emit('snackbar', {
            display: true
          });
      });
  }
  export  function updateImage(e){
      let formData = new FormData();
    formData.append('document', e.form.blob);
    formData.append('cathegorie', 'image');
    formData.append('name', `${e.name}_project`);
    formData.append('type', e.form.blob.type.replace('image/',''));
    formData.append('_id', e.image._id);

    this.$axios.put('/api/doc',
    formData,
    {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
        'enctype': 'multipart/form-data'
      },

    }).then(({data})=>{
      if(data.status){

        e.image.name = data.doc.name;
        e.image.src = data.doc.src;
        e.form.submitting = false;
        e.mode = 'preview';
        this.$root.$emit('snackbar',{
          display: true,
          text: i18n.tc(`fonctions.projetUpdate`),
        });
      }else{
        e.form.submitErrors =  JSON.stringify(data.errors);
        this.$root.$emit('snackbar',{
          display: true,
          text: JSON.stringify(data.errors),
        });


      }
    }).catch(err=>{
      e.submitting = false;
        this.$root.$emit('snackbar', {
        display: true
      });
      this.$root.$emit('neterror', { err: err, callback: this.sendImage, data: projectId });
    })
  }
  export  function saveForm (e){
    e.form.submitting = true;
    setTimeout( () => this.$axios.put(`/api/project/${e._id}`,{
      name: e.form.name,
      description: e.form.description,
      short_description: e.form.short_description,
      cathegories: e.form.cathegories,
    }, {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
      }
    })
    .then(({ data }) => {
      if(data.status){
        e.localUpdate();
        if(e.image._id){
          if(e.image.src != e.form.src){
            e.updateImage();
          }else{
            e.form.submitting = false;

            e.mode = 'preview';
            this.$root.$emit('snackbar',{
              display: true,
              text: i18n.tc(`fonctions.projetUpdate`),
            })
          }

        }else{
          if(!e.form.blob){
            e.form.submitting = false;
            e.mode = 'preview';
            this.$root.$emit('snackbar',{
              display: true,
              text: i18n.tc(`fonctions.projetUpdate`),
            })
          }else{
            e.sendImage();
          }
        }
      }else{
        e.form.submitErrors =  data.errors;
      }
    })
    .catch((err) => {

      e.form.submitting = false;
      this.$root.$emit('snackbar', { display: true });
      this.$root.$emit('neterror', { err: err, callback: this. deleteProject, data: { id, index } });
    }),500);
  }
  export  function sendDoc(e,doc){
      let formData = new FormData();
    formData.append('document',doc);
    formData.append('cathegorie',doc.type.replace(/\/.*/,''));
    formData.append('name',`${doc.name.replace(/\..*/,'')}_project_${this.voter.name}`);
    formData.append('type', doc.type.replace(/.*\//,''));

    this.$axios.post('/api/doc',
    formData,
    {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
        'enctype': 'multipart/form-data'
      },

    }).then(({ data }) => {
      if(data.status){
        e.docs.push(data.document);
        e.updateProjectDoc(data.document._id);
        //e.updateImgRef(data.document._id, e._id);
      }else{
        this.$root.$emit('snackbar',{
          display: true,
          text: JSON.stringify(data.errors),
        });

        e.form.submitting = false;
      }
    }).catch(err=>{
      //e.form.submitting = false;
        this.$root.$emit('snackbar', {
        display: true
      });
      this.$root.$emit('neterror', { err: err, callback: e.sendDoc, data: doc });
    });
  }
  export  function sendImage(e){
    let formData = new FormData();
    formData.append('document',e.form.blob);
    formData.append('cathegorie','image');
    formData.append('name',`${e.name}_project_${this.voter.name}`);
    formData.append('type', e.form.blob.type.replace('image/',''));

    this.$axios.post('/api/doc',
    formData,
    {
      headers: {
        'CSRF-Token': this.$Cookies.get('XSRF-TOKEN'),
        'enctype': 'multipart/form-data'
      },

    }).then(({ data }) => {
      if(data.status){
        e.image = data.document;
        e.updateImgRef(data.document._id, e._id);
      }else{
        this.$root.$emit('snackbar',{
          display: true,
          text: JSON.stringify(data.errors),
        });

        e.form.submitting = false;
      }
    }).catch(err=>{
      e.form.submitting = false;
        this.$root.$emit('snackbar', {
        display: true
      });
      this.$root.$emit('neterror', { err: err, callback: e.sendImage, data: projectId });
    });
  }
  export  function deleteProject(e) {
    e.deleteDialogue = false;
        this.$axios.delete(`/api/project/${e._id}`, {
            headers: {
              'CSRF-Token': this.$Cookies.get('XSRF-TOKEN')
            }
          })
          .then(({data}) => {
            e.deleted = data.status;
            if(data.status){
              this.$root.$emit('snackbar', { display: true, text: 'project delete with success' });
            }else{
              this.$root.$emit('snackbar', { display: true, text: JSON.stringify(data.errors) });
            }

          })
          .catch((err) => {
            this.$root.$emit('snackbar', { display: true });
            this.$root.$emit('neterror', { err: err, callback: e.deleteProject });
          })
      }
  export function validate(e,action){

    e.form.submitting = true;
    this.$axios.get(`/api/project/${action}/${e._id}`)
    .then(({data}) => {
      e.deleted = data.status;
      if(data.status){
        this.$root.$emit('snackbar', { display: true, text: `project ${action} with success` });
      }else{
        this.$root.$emit('snackbar', { display: true, text: JSON.stringify(data.errors) });
      }

    })
    .catch((err) => {
      this.$root.$emit('snackbar', { display: true });

    })
  }

import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

     const ALPHA_LEN = 26;
     sample_len = 1;
     batch_size = 32;
     epochs = 250;
     max_len = 10;
     words = [];
     model = create_model(this.max_len,this.ALPHA_LEN);
     
     status = "";
     setup(){
      document.getElementById('file')?.addEventListener('change', function() { 
        const fr = new FileReader(); 
        let result: any; 
        let filesize: any; 
        let delimiters: any; 
        let element = document.getElementById('file_name')?.innerText;
        let words: any;
        const fileInput = document.getElementById('file') as HTMLInputElement; // cast to HTMLInputElement
      
        fr.onload = function() { 
          result = fr.result
          filesize = result.length
          delimiters = ['\r\n',',','\t',' '];
          if(element != null) {
            element = "Supported format: csv, tsv, txt.";
            if (fileInput.files != null && fileInput.files.length > 0) { // check if files is not null and has at least one item
              for (let i in delimiters) {
                length = result.split(delimiters[i]).length
                if (length != filesize && length > 1) {
                  words=result.split(delimiters[i]);
                  if (fileInput.files[0] != null) { // check if the first item in files is not null
                    element = fileInput.files[0].name; // access files property using the fileInput variable
                  }
                }
              }
            } else {
              element = "No file selected.";
            }
          }
        }    
        if (fileInput.files != null && fileInput.files.length > 0) { // check if files is not null and has at least one item
          fr.readAsText(fileInput.files[0]); // read file using the fileInput variable
        }
      }) 
      document.getElementById('train')?.addEventListener('click', async () => {
        let filtered_words;
        let int_words;
        let train_features;
        let train_labels;
        let documentStatus; 
        let documentTrain; 
        if (this.words == null || this.words.length <= 0) {
          alert("No dataset");
          return;
        }
        documentStatus = document.getElementById("status");
        if (documentStatus != null) {
          documentStatus.style.display = "block";
        }        
        documentTrain = document.getElementById("train");
        if (documentTrain != null) {
          documentTrain.style.display = "none";
        }

        try {
          filtered_words = preprocessing_stage_1(this.words, this.max_len);
          int_words = preprocessing_stage_2(filtered_words, this.max_len);
          train_features = preprocessing_stage_3(int_words, this.max_len, this.sample_len);
          train_labels = preprocessing_stage_4(int_words, this.max_len, this.sample_len);
          train_features = preprocessing_stage_5(train_features, this.max_len, this.ALPHA_LEN);
          train_labels = preprocessing_stage_5(train_labels, this.max_len, this.ALPHA_LEN);
          this.model = await create_model(this.max_len, this.ALPHA_LEN);
          await trainModel(this.model, train_features, train_labels);
          await this.model.save('downloads://autocorrect_model');
          //memory management
          train_features.dispose();
          train_labels.dispose();
        } catch (err) {
          alert("No enough GPU space. Please reduce your dataset size.");
        }
        documentStatus = document.getElementById("status");
        if (documentStatus != null) {
          documentStatus.style.display = "block";
        }        
        documentTrain = document.getElementById("train");
        if (documentTrain != null) {
          documentTrain.style.display = "none";
        }
      });
      document.getElementById('pred_features')?.addEventListener('keyup',()=>{
        console.log( document.getElementById('pred_features')?.value);
        let pattern = new RegExp("^[a-z]{1,"+max_len+"}$");
        let pred_features = []
        pred_features.push(document.getElementById('pred_features')?.value);
        if(pred_features[0].length<this.sample_len+1 ||  !pattern.test(pred_features[0])){
           document.getElementById('pred_labels')?.value="";
          return;
        }
        pred_features = preprocessing_stage_2(pred_features,this.max_len);
        pred_features = preprocessing_stage_5(pred_features,this.max_len, this.ALPHA_LEN);
        let pred_labels = model.predict(pred_features);
        pred_labels = postprocessing_stage_1(pred_labels)
        pred_labels = postprocessing_stage_2(pred_labels,this.max_len)[0]
        document.getElementById('pred_labels')?.value=pred_labels.join("");

      })
      document.getElementById("max_len")?.value=this.max_len
      document.getElementById("epochs")?.value=this.epochs
      document.getElementById("batch_size").value=this.batch_size
      document.getElementById("pred_features")?.maxLength = document.getElementById("max_len")?.value;

    }
    showVizer(){
      const visorInstance = tfvis.visor();
      if (!visorInstance.isOpen()) {
        visorInstance.toggle();
      }
    }

    preprocessing_stage_1(words:any,max_len:any){
      // function to filter the wordlist 
      // string [] = words
      // int = max_len
      status = "Preprocessing Data 1";
      console.log(status);
      let filtered_words = [];
      var pattern = new RegExp("^[a-z]{1,"+max_len+"}$");
      for (let i in words){
        var is_valid = pattern.test(words[i]);
        if (is_valid) filtered_words.push(words[i]);
      }
      return filtered_words;
    }
    preprocessing_stage_2(words:any,max_len:any){
      // function to convert the wordlist to int 
      // string [] = words
      // int = max_len
      status = "Preprocessing Data 2";
      console.log(status);
      let int_words = [];
      for (let i in words){
        int_words.push(word_to_int(words[i],max_len))
      }
      return int_words;
    }
    function preprocessing_stage_3(words:any,max_len:any,sample_len:any){
      // function to perform sliding window on wordlist
      // int [] = words
      // int = max_len, sample_len
      status = "Preprocessing Data 3";
      console.log(status);
      let input_data = [];
      for (let x in words){
        let letters = [];
        for (let y=sample_len+1;y<max_len+1;y++){
          input_data.push(words[x].slice(0,y).concat(Array(max_len-y).fill(0)));
        }
      }
      return input_data;
    }
    function preprocessing_stage_4(words:any,max_len:any,sample_len:any){
      // function to ensure that training data size y == x
      // int [] = words
      // int = max_len, sample_len
      status = "Preprocessing Data 4";
      console.log(status);
      let output_data = [];
      for (let x in words){
        for (let y=sample_len+1;y<max_len+1;y++){
          output_data.push(words[x]);
        }
      }
      return output_data;
    }
    function preprocessing_stage_5(words:any,max_len:any,alpha_len:any){
      // function to convert int to onehot encoding 
      // int [] = words
      // int = max_len, alpha_len
      status = "Preprocessing Data 5";
      console.log(status);
      return tf.oneHot(tf.tensor2d(words,[words.length,max_len],dtype='int32'), alpha_len);
    }
    function postprocessing_stage_1(words){
      //function to decode onehot encoding
      return words.argMax(-1).arraySync();
    }
    function postprocessing_stage_2(words:any,max_len:any){
      //function to convert int to words
      let results = [];
      for (let i in words){
        results.push(int_to_word(words[i],max_len));
      }
      return results;
    }
    function word_to_int (word:any,max_len:any){
      // char [] = word
      // int = max_len
      let encode = [];
      for (let i = 0; i < max_len; i++) {
        if(i<word.length){
          let letter = word.slice(i, i+1);
          encode.push(letter.charCodeAt(0)-96);
        }else{
          encode.push(0)
        }
      }
      return encode;
    }
    function int_to_word (word:any,max_len:any){
      // int [] = word
      // int = max_len
      let decode = []
      for (let i = 0; i < max_len; i++) {
        if(word[i]==0){
          decode.push("");
        }else{
          decode.push(String.fromCharCode(word[i]+96))
        }
        
      }
      return decode;
    }
    async function create_model(max_len:any,alpha_len:any){
      var model = tf.sequential();
      await model.add(tf.layers.lstm({
        units:alpha_len*2,
        inputShape:[max_len,alpha_len],
        dropout:0.2,
        recurrentDropout:0.2,
        useBias: true,
        returnSequences:true,
        activation:"relu"
      }))
      await model.add(tf.layers.timeDistributed({
         layer: tf.layers.dense({
          units: alpha_len,
          dropout:0.2,
          activation:"softmax"
        })
      }));
      model.summary();
      return model
    }
    async function trainModel(model:any, train_features:any, train_labels:any) {
      status = "Training Model";
      console.log(status)
      // Prepare the model for training.
      model.compile({
        optimizer: tf.train.adam(),
        loss: 'categoricalCrossentropy',
        metrics: ['mse'] 
      })
      await model.fit(train_features, train_labels, {
        epochs,
        batch_size,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
          { name: 'Training' },
          ['loss', 'mse'],
          { height: 200, callbacks: ['onEpochEnd'] }
        )
      });
      
      
      return;
    }
 
}

  



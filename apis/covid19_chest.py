# main.py on GCP

import json
import requests
import tensorflow as tf
import numpy as np
import pickle
import os

os.mkdir('/tmp/model')

def create_model()
    vggModel = VGG19(weights="imagenet", include_top=False, input_tensor=Input(shape=(224, 224, 3)))

    outputs = vggModel.output
    outputs = Flatten(name="flatten")(outputs)
    outputs = Dropout(0.5)(outputs)
    outputs = Dense(2, activation="softmax")(outputs)

    model = Model(inputs=vggModel.input, outputs=outputs)

    for layer in vggModel.layers:
        layer.trainable = False

    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

    return model


def load_image(image_path):
    img = tf.io.read_file(image_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, (512, 624))
    img = tf.keras.applications.inception_v3.preprocess_input(img)
    return img, image_path

# Inputs image path

def load_model(path):
    model_h5_path = 'https://drive.google.com/uc?export=download&id=1T6vD_a6ndnnBpi2nyLopWj-Y4_yBFTjZ'
    
    
    open(path + '/covid19_model.h5', 'wb').write(requests.get(model_h5_path).content)

    #path = Path('/tmp')

    model = keras.models.load_model(path + '/covid19_model.h5')

    return model


def predict(image_path, model):
    batch_size = 32
    img = open_image(image_path)
    pred_class, pred_idx, outputs = model.predict(img, batch_size = batch_size)
    p=sorted(zip(learner.data.classes, 
               map(float, outputs)),
           key=lambda p: p[1],
           reverse=True)[0]
    grad=p[0]        
    conf=round(p[1],3)   
    return(grad,conf,model_name)


def handler(request):
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return json.dumps({'msg':'No file part'})
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return json.dumps({'msg':'No file name'})
        if file :
            if file.filename.rpartition('.')[2] in ['jpg','JPG','jpeg','JGEG','png','PNG']:
                saved_file_path='/tmp/'+ file.filename
                file.save(saved_file_path)
                path = '/tmp'
                model = load_model(path)
                result = predict(saved_file_path, model)
                return json.dumps({"File Name":file.filename,
                                   "Predicted Caption":result})
            else:
                return json.dumps({"File Name":file.filename,
                                   "Error":"File type {} not supported".format(file.filename.rpartition('.')[2]),
                                   "Suggestion":"Please choose any of jpg,JPG,jpeg,JGEG,png,PNG"})
# main.py on GCP
import json
import requests
import tensorflow as tf
import numpy as np
import pickle
import os
#import cv2 # Not available in Google Cloud Functions
import glob

os.mkdir('/tmp/model')

def create_model():
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
    img_glob = glob(image_path)
    img = tf.io.read_file(image_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, (224, 224))

    # image = cv2.imread(img_glob[0])
    # image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # image = cv2.resize(image,(224,224))
    image = np.array(img)/255

    test = np.array([image, image, image])
    test = np.concatenate((test, test), axis=0)

    return test

# Inputs image path

def load_model(path):
    model_h5_path = 'https://drive.google.com/uc?export=download&id=1-2r-cZFE-Fn-zJsBS2qlLyd7TseOH_sM'
    
    
    open(path + '/covid19_model.h5', 'wb').write(requests.get(model_h5_path).content)

    #path = Path('/tmp')

    model = keras.models.load_model(path + '/covid19_model.h5')

    return model


def predict(image_path, model):
    batch_size = 32
    test = load_image(image_path)

    prediction = model.predict(test, batch_size = batch_size)

    result = 'Positive for COVID19' if prediction[0][1] > 0.5 else 'Negative for COVID19'
    probability = prediction[0][1]*100 if prediction[0][1] > 0.5 else (1-prediction[0][1])*100


    return (result, probability)


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
                result, probability = predict(saved_file_path, model)
                return json.dumps({"File Name":file.filename,
                                   "Diagnosis":result,
                                   "Accuracy":probability})
            else:
                return json.dumps({"File Name":file.filename,
                                   "Error":"File type {} not supported".format(file.filename.rpartition('.')[2]),
                                   "Suggestion":"Please choose any of jpg,JPG,jpeg,JGEG,png,PNG"})
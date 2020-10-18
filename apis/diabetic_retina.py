import json
import urllib.request
import time
from fastai.vision import *

def predict(image_path):
    defaults.device = torch.device('cpu')
    model = 'https://drive.google.com/uc?export=download&id=1F2gbhaseOOKPuRuwswLGXo8aus8zAMj1'
    model_name=model.rpartition('/')[2]
    urllib.request.urlretrieve(model, '/tmp/aptos.pkl')
    path = Path('/tmp')
    learner = load_learner(path, 'aptos.pkl')
    
    img = open_image(image_path)
    pred_class,pred_idx,outputs = learner.predict(img)
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
                grad,conf,model_name=predict(saved_file_path)
                conf='{0:.2f}'.format(round(conf,2))
                return json.dumps({"File Name":file.filename,
                                   "Predicted Class":grad,
                                   "Confidence":conf})
            else:
                return json.dumps({"File Name":file.filename,
                                   "Error":"File type {} not supported".format(file.filename.rpartition('.')[2]),
                                   "Suggestion":"Please choose any of jpg,JPG,jpeg,JGEG,png,PNG"})
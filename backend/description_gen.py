from PIL import Image
import torch
from lavis.models import load_model_and_preprocess
import pickle

class DescriptionGen:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")     
        try:
            self.model = pickle.load(open('model.pickle','rb'))
            self.vis_processors = pickle.load(open('vis_processors.pickle','rb'))
        except (OSError, IOError) as e:
            self.model, self.vis_processors, _ = load_model_and_preprocess(name="blip_caption", model_type="base_coco", is_eval=True, device=self.device)
            pickle.dump(self.model, open('model.pickle','wb'))
            pickle.dump(self.vis_processors, open('vis_processors.pickle','wb'))
   
    def preprocess_image(self, raw_image):
        image = self.vis_processors["eval"](raw_image).unsqueeze(0).to(self.device)
        return image

    def generate_description(self, stream):
        raw_image = Image.open(stream).convert("RGB")
        image = self.preprocess_image(raw_image)
        caption = self.model.generate({"image": image})
        return caption


if __name__ == '__main__':
    gen = DescriptionGen()
    
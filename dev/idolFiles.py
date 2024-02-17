from os import listdir;
import json;

idolFiles = [f for f in listdir('/Users/siobhande/repos/eyedle/assets/images/idols')];
del idolFiles[0];


stringIdol = ",".join(str(x) for x in idolFiles)

print(idolFiles);
with open('/Users/siobhande/repos/eyedle/assets/idolData.json', 'w') as file:
    json.dump(idolFiles, file);


with open('/Users/siobhande/repos/eyedle/assets/idolData.js', 'a') as file:
    file.write(stringIdol);

#conding=utf8  
import os 

g = os.walk(r"./bin/res/ui/")  

for path,dir_list,file_list in g:  
    for file_name in file_list:  
        
        if os.path.splitext(file_name)[-1][1:] == "png" or os.path.splitext(file_name)[-1][1:] == "jpg" :
            print(os.path.join(path, file_name) )
            # cwebp Login_atlas01.png -q 80 -lossless -o output.webp
            print(os.path.splitext(file_name)[0])
            fileNamePrefix = os.path.splitext(file_name)[0]
            #cmd = "cwebp " +os.path.join(path, file_name)+" -q 80 -lossless -o " +os.path.join(path,fileNamePrefix)+".webp"
            #cmd = "cwebp " +os.path.join(path, file_name)+" -q 75 -m 4 -near_lossless 80 -o " +os.path.join(path,fileNamePrefix)+".webp"
            cmd = "cwebp " +os.path.join(path, file_name)+" -q 75 -m 4 -o " +os.path.join(path,fileNamePrefix)+".webp"
            print("cmd="+cmd)
            os.system(cmd)
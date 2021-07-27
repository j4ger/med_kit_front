source = "楠梓区、左营区、鼓山区、三民区、盐埕区、前金区、新兴区、苓雅区、前镇区、旗津区、小港区、凤山区、大寮区、鸟松区、林园区、仁武区、大树区、大社区、冈山区、路竹区、桥头区、梓官区、弥陀区、永安区、燕巢区、田寮区、阿莲区、茄萣区、湖内区、旗山区、美浓区、内门区、杉林区、甲仙区、六龟区、茂林区、桃源区、那玛夏区"
initial = start = 710600

splitted_source = source.split("、")

output = []
for sub in splitted_source:
    start += 1
    substring = f'{start}:"{sub}"'
    output.append(substring)

joined_output = ",".join(output)
print(f"{initial}:{{{joined_output}}}")

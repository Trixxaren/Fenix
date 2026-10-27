import { useState } from "react";
import { Image } from "expo-image";
import { StyleProp, View, ViewStyle } from "react-native";
import { Copy } from "./ui";
import { colors } from "../theme";

const photos: Record<string, number> = {
  "portrait-1": require("../../assets/portraits/1.jpg"),
  "portrait-2": require("../../assets/portraits/2.jpg"),
  "portrait-3": require("../../assets/portraits/3.jpg"),
  "portrait-4": require("../../assets/portraits/4.jpg"),
  "portrait-5": require("../../assets/portraits/5.jpg"),
  "portrait-6": require("../../assets/portraits/6.jpg"),
  "portrait-7": require("../../assets/portraits/7.jpg"),
  "portrait-8": require("../../assets/portraits/8.jpg"),
  "portrait-9": require("../../assets/portraits/9.jpg"),
  "portrait-10": require("../../assets/portraits/10.jpg"),
  "portrait-11": require("../../assets/portraits/11.jpg"),
  "portrait-12": require("../../assets/portraits/12.jpg"),
  "portrait-13": require("../../assets/portraits/13.jpg"),
  "portrait-14": require("../../assets/portraits/14.jpg"),
  "portrait-15": require("../../assets/portraits/15.jpg"),
  "portrait-16": require("../../assets/portraits/16.jpg"),
  "portrait-17": require("../../assets/portraits/17.jpg"),
  "portrait-18": require("../../assets/portraits/18.jpg"),
  "portrait-19": require("../../assets/portraits/19.jpg"),
  "portrait-20": require("../../assets/portraits/20.jpg"),
  "portrait-21": require("../../assets/portraits/21.jpg"),
  "portrait-22": require("../../assets/portraits/22.jpg"),
  "portrait-23": require("../../assets/portraits/23.jpg"),
};
export function Portrait({
  photo,
  name,
  style,
}: {
  photo: string;
  name: string;
  style?: StyleProp<ViewStyle>;
}) {
  const [failed, setFailed] = useState("");
  return (
    <View style={[{ backgroundColor: colors.sage, overflow: "hidden" }, style]}>
      {failed === photo || !photo ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 12,
          }}
        >
          <Copy variant="title" style={{ color: colors.green }}>
            {name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </Copy>
        </View>
      ) : (
        <Image
          source={photos[photo] ?? { uri: photo }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          contentPosition="center"
          accessibilityLabel={`Profilbild för ${name}`}
          onError={() => setFailed(photo)}
          transition={180}
        />
      )}
    </View>
  );
}

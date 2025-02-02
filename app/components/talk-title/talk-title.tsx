import * as React from "react"
import { View, ViewStyle, TextStyle, Linking, Platform } from "react-native"
import { Text } from "../text"
import { palette, spacing } from "../../theme"
import { BulletItem } from "../bullet-item/bullet-item"

const ROOT: ViewStyle = {
  width: "100%",
}

const LABEL: TextStyle = {
  marginTop: spacing.extraLarge + spacing.large,
  color: palette.shamrock,
  marginBottom: spacing.large,
}

const TITLE: TextStyle = {
  fontSize: 24,
}

export class TalkTitle extends React.Component<{ talk: any }, {}> {
  render() {
    const { talkType } = this.props.talk
    switch (talkType.toLowerCase()) {
      case "talk":
        return this.renderTalk()
      case "workshop":
        return this.renderWorkshop()
      default:
        return null
    }
  }

  renderTalk = () => {
    const { title, speakers } = this.props.talk
    const splitName = speakers ? speakers[0].name.split(" ") : [""]
    return (
      <View style={ROOT}>
        <Text text={`${splitName[0].toUpperCase()}'S TALK`} preset="sectionHeader" style={LABEL} />
        <Text text={title} preset="header" style={TITLE} />
      </View>
    )
  }

  renderWorkshop = () => {
    const { title, location, description, prerequisites } = this.props.talk
    const label = location.split("\n")[0]
    const query = location
      .split("\n")
      .slice(1)
      .join(" ")
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${query}`,
      android: `geo:0,0?q=${query}(${label})`,
    })
    return (
      <View style={ROOT}>
        <Text tx="talkDetailsScreen.workshop" preset="sectionHeader" style={LABEL} />
        <Text text={title} preset="header" style={TITLE} />
        <Text tx="talkDetailsScreen.location" preset="sectionHeader" style={LABEL} />
        <Text
          text={location}
          preset="subheader"
          style={{ color: palette.white, fontWeight: "500" }}
          onPress={() => Linking.openURL(url)}
        />
        <Text tx="talkDetailsScreen.aboutWorkshop" preset="sectionHeader" style={LABEL} />
        <Text text={description} preset="body" />
        {prerequisites && (
          <Text tx="talkDetailsScreen.prerequisites" preset="sectionHeader" style={LABEL} />
        )}
        {prerequisites &&
          prerequisites.map((prerequisite, index) => (
            <BulletItem text={prerequisite} key={index} />
          ))}
      </View>
    )
  }
}

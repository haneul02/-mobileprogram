import {Image} from 'react-native'

const TabBarIcon = (focused, name) => {
  let iconTmagePath;
  if(name === "메인"){
    iconTmagePath = require ('../assets/home.png')
  }else if (name === "칼로리검색"){
    iconTmagePath = require ('../assets/salad.png')
  }

  return(
    <Image style = {{
      width: focused ? 24:20,
      height: focused ? 24:20,
    }}
    source = {iconTmagePath}
    />
  )
}

export default TabBarIcon
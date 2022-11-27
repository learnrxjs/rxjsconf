interface Props {
  key: string
}

const translates = {
  ru: {
    speaker_socials: {
      twitter: "Твиттер",
      telegram: "Телеграм",
      
    }
  }
}

export function i18n({ key }: Props) {
  const keys = key.split(".")
  const value = keys.reduce((obj, k) => Reflect.get(obj, k), translates.ru)

  if (value) {
    return <>{ value }</>
  }

  return <>{ key }</>
}

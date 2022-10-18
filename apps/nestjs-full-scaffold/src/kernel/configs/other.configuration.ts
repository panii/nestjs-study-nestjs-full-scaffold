export default () => ({
  level1: {
    level2: "xxx", // this will overwrite base configuration
  },
  an_object: { // this.configService.get<anObject>('an_object')
    str: "hello world",
    num: 123123,
  }
});

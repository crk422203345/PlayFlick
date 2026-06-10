declare module '@/api/modules' {
  export const homeApi: {
    selectBannerList(params?: { classify?: number; languageType?: string }): Promise<{
      code: number
      msg: string
      data: Array<{
        id: number
        name: string
        imageUrl: string
        state: number
        classify: number
        url: string
        describes: string | null
        languageType: string
        languageName: string
      }>
    }>
    selectCourse(params?: { page?: number; limit?: number; languageType?: string }): Promise<{
      code: number
      msg: string
      data: {
        totalCount: number
        pageSize: number
        totalPage: number
        currPage: number
        list: Array<{
          courseId: number
          courseDetailsId: number
          title: string
          img: string
          titleImg: string
          classificationName: string
          details: string
          goodNum: number
          viewCounts: number
          languageType: string
          languageName: string
          status: number
          isDelete: number
        }>
      }
    }>
    selectHotCourseRanking(params?: {
      limit?: number
      page?: number
      sort?: number
      classifyId?: string | number
      languageType?: string
    }): Promise<{
      code: number
      msg: string
      data: {
        totalCount: number
        pageSize: number
        totalPage: number
        currPage: number
        list: Array<{
          courseId: number
          courseDetailsId: number
          title: string
          img: string
          titleImg: string
          classificationName: string
          details: string
          goodNum: number
          viewCounts: number
          languageType: string
          languageName: string
          status: number
          isDelete: number
        }>
      }
    }>
    queryClassification(params?: { languageType?: string }): Promise<{
      code: number
      msg: string
      data: Array<{
        classificationId: number
        classificationName: string
      }>
    }>
    selectHotGames(data?: {
      type?: string
      edition?: string
      order?: string
      gametype?: string
      page?: number
      pagecode?: number
      key?: string
      appid?: string
      versionCode?: number
    }): Promise<{
      lists: Array<{
        id: number
        pic1: string
        pic4: string
        downloadnum: string
        gamename: string
        game_tag: string
        typeword: string
        gametype: string
        gametype1: string
        gametype2: string
        gametypes: string[]
      }>
      now_page: number
      total_number: number
      total_page: number
    }>
  }

  export const gameApi: {
    getGameTypes(data?: {
      type?: string
      key?: string
      appid?: string
      versionCode?: number
    }): Promise<{
      a: string
      b: string
      c: Array<{
        id: string | number
        name: string
      }>
    }>
  }
}

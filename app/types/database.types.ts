export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name?: string | null
          email?: string | null
          role?: string | null
          bio?: string | null
          // add other columns
        }
        Insert: {
          id: string
          name?: string | null
          // ...
        }
      }
    }
  }
}
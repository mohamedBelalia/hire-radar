type User = {
  id: number
  full_name: string;
  email: string;
  role: "candidate" | "employer" | "admin";
  image: string
};

type Job = {
  id: number
  employer_id: number
  category_id: number
  title: string
  company: string
  location: string
  created_at: Date
}

type Skill = {
  id: number
  name: string
}

type Category = {
  id: number
  name: string
}
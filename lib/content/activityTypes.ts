export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  STUDY_VISIT: "Study Visit",
  PARTNERSHIP_BUILDING: "Partnership-building Activity",
  SEMINAR: "Seminar",
  TRAINING_COURSE: "Training Course",
  E_LEARNING: "E-learning",
  CONFERENCE: "Conference – Symposium - Forum",
};

export const ACTIVITY_TYPE_DESCRIPTIONS: Record<string, string> = {
  STUDY_VISIT:
    "An organised study programme, for a short period, that offers a view of youth work and/or youth policy provisions in one country. Study visits focus on a theme and consist of visits and meetings to different projects and organisations in a chosen country.",
  PARTNERSHIP_BUILDING:
    "An activity organised in order to allow participants – youth organisations managers or programme coordinators, youth workers, youth leaders, youth trainers, etc. – to find partners for transnational cooperation and/or project development. Partnership-Building Activities bring together potential partners and supports developing new projects in the frame of the Erasmus+: Youth in Action programme (and beyond).",
  SEMINAR:
    "An activity organised with the aim to provide a structured space for youth work practitioners (e.g. youth organisations managers or programme coordinators, youth workers, youth leaders, youth trainers, youth researchers) to explore and exchange on good practices, based on a participative and balanced methodology, around a chosen theme intrinsically linked to the field of youth work.",
  TRAINING_COURSE:
    "An educational learning project focusing on a specific theme, aiming to contribute to a higher quality in youth work and to improve participants' competences (values, attitudes, knowledge, and skills). Training courses in this context are primarily designed for youth workers, youth leaders and youth trainers. They can be residential courses or blended courses.",
  E_LEARNING:
    "An exclusively online educational learning project focusing on a specific theme, aiming to contribute to a higher quality in youth work and to improve participants' competences (values, attitudes, knowledge, and skills). E-learning courses in this context are primarily designed for youth workers, youth leaders and youth trainers.",
  CONFERENCE:
    "A usually large-scale event organised with the aim to provide a structured space for youth researchers, youth policy-makers, youth work practitioners, and other partners to explore and exchange around a chosen theme intrinsically linked to the field of youth work, with the aim to produce material for further developments in the field of youth.",
};

export const ACTIVITY_TYPES = Object.keys(ACTIVITY_TYPE_LABELS);

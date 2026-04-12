import type { Disease, DiseaseKey } from '../types'

export const DISEASES: Record<DiseaseKey, Disease> = {
  HIV: { name: '艾滋病 (HIV)', riskType: 'fluid', desc: '免疫崩溃，不可逆转。', transmission: '体液传播' },
  SYPHILIS: { name: '梅毒', riskType: 'contact', desc: '全身红斑，侵蚀神经。', transmission: '接触传播' },
  HERPES: { name: '疱疹', riskType: 'skin', desc: '终身携带，反复剧痛。', transmission: '皮肤接触' },
  HPV: { name: '尖锐湿疣', riskType: 'contact', desc: '菜花突起，极难根治。', transmission: '接触传播' },
  GONORRHEA: { name: '淋病', riskType: 'fluid_mucous', desc: '流脓刺痛。', transmission: '体液粘膜' },
  CRABS: { name: '阴虱', riskType: 'skin_hair', desc: '剧烈瘙痒。', transmission: '密切接触' },
  CHLAMYDIA: { name: '衣原体', riskType: 'fluid_mucous', desc: '隐匿感染，导致不孕。', transmission: '体液粘膜' },
  HEPATITIS_B: { name: '乙肝', riskType: 'fluid', desc: '肝损伤，慢性化风险。', transmission: '血液/体液传播' },
  TRICHOMONIASIS: { name: '滴虫病', riskType: 'fluid', desc: '分泌物异常，瘙痒异味。', transmission: '体液传播' },
}

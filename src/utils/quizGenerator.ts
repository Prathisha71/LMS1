export function generateQuiz(subjectTitle: string, chapterTitle: string, topicTitle: string) {
  const subject = subjectTitle.toLowerCase();
  let questions: any[] = [];

  const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

  if (subject.includes('science') || subject.includes('physics') || subject.includes('chem') || subject.includes('bio')) {
    questions = [
      {
        question: `What is the fundamental SI unit associated with ${topicTitle}?`,
        options: ['Newton', 'Joule', 'Kilogram', 'Meter/second'],
        correctAnswerIndex: 1,
        explanation: `Joules and Newtons are common SI units in Science when evaluating ${topicTitle}.`
      },
      {
        question: `Which scientist is most closely associated with the primary laws of ${topicTitle}?`,
        options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Marie Curie'],
        correctAnswerIndex: 0,
        explanation: 'Newton formulated many of the fundamental laws governing physical science and motion.'
      },
      {
        question: `When dealing with ${topicTitle}, what happens to energy in a closed system?`,
        options: ['It is created', 'It is destroyed', 'It remains constant (conserved)', 'It fluctuates randomly'],
        correctAnswerIndex: 2,
        explanation: 'According to the law of conservation of energy, total energy in an isolated system remains constant.'
      },
      {
        question: `Which of the following equations represents a core principle of ${chapterTitle}?`,
        options: ['F = ma', 'E = mc²', 'V = IR', 'P = IV'],
        correctAnswerIndex: 0,
        explanation: 'Force equals mass times acceleration (F=ma) is a foundational equation in physics and kinematics.'
      },
      {
        question: `What is the most common experimental method to verify ${topicTitle}?`,
        options: ['Titration', 'Spectroscopy', 'Direct Observation and Measurement', 'Calorimetry'],
        correctAnswerIndex: 2,
        explanation: 'Direct observation using precise instruments is crucial for validating scientific theories.'
      },
      {
        question: `If the initial state of ${topicTitle} is doubled, how does the system typically react in a linear model?`,
        options: ['It halves', 'It remains the same', 'It doubles as well', 'It quadruples'],
        correctAnswerIndex: 2,
        explanation: 'In directly proportional relationships (linear), doubling the input doubles the output.'
      },
      {
        question: `What is the primary difference between scalar and vector quantities in the context of ${topicTitle}?`,
        options: ['Vectors have direction, scalars do not', 'Scalars have direction, vectors do not', 'They are identical', 'Vectors only measure mass'],
        correctAnswerIndex: 0,
        explanation: 'Vectors possess both magnitude and direction, whereas scalars only have magnitude.'
      },
      {
        question: `In the study of ${topicTitle}, how does friction generally affect motion?`,
        options: ['It accelerates it', 'It has no effect', 'It opposes motion', 'It changes the mass'],
        correctAnswerIndex: 2,
        explanation: 'Friction is a resistive force that opposes relative motion between surfaces.'
      },
      {
        question: `Which biological or chemical principle closely mirrors the stability found in ${topicTitle}?`,
        options: ['Homeostasis', 'Photosynthesis', 'Fermentation', 'Meiosis'],
        correctAnswerIndex: 0,
        explanation: 'Homeostasis refers to the maintenance of a stable, internal equilibrium.'
      },
      {
        question: `Why is the study of ${topicTitle} important for modern engineering?`,
        options: ['It is not important', 'It helps in designing structurally sound materials', 'It only applies to biology', 'It is purely theoretical'],
        correctAnswerIndex: 1,
        explanation: 'Understanding foundational physical and material sciences is essential for safe structural design.'
      }
    ];
  } else if (subject.includes('math')) {
    questions = [
      {
        question: `What is the primary formula used to solve problems in ${topicTitle}?`,
        options: ['Quadratic Formula', 'Pythagorean Theorem', "Euler's Formula", 'Depends on the specific parameter of the problem'],
        correctAnswerIndex: 3,
        explanation: `Problems in ${topicTitle} require selecting the appropriate mathematical framework based on the variables given.`
      },
      {
        question: `If x represents the main variable in ${topicTitle}, what does the first derivative represent?`,
        options: ['Area under the curve', 'Rate of change', 'The total volume', 'The absolute maximum'],
        correctAnswerIndex: 1,
        explanation: 'In calculus, the first derivative of a function evaluates its instantaneous rate of change.'
      },
      {
        question: `Solve for the typical outcome when studying ${topicTitle}: If 2x + 4 = 12, what is x?`,
        options: ['2', '4', '6', '8'],
        correctAnswerIndex: 1,
        explanation: 'Subtract 4 from 12 to get 8, then divide by 2 to find x = 4.'
      },
      {
        question: `Which geometric shape is most often associated with the principles of ${chapterTitle}?`,
        options: ['Circle', 'Right Triangle', 'Hexagon', 'Parabola'],
        correctAnswerIndex: 1,
        explanation: 'Right triangles form the basis of trigonometry and many foundational geometric proofs.'
      },
      {
        question: `When dealing with ${topicTitle}, what is the sum of interior angles of a triangle?`,
        options: ['90 degrees', '180 degrees', '360 degrees', '270 degrees'],
        correctAnswerIndex: 1,
        explanation: 'The sum of all interior angles in any planar triangle is always exactly 180 degrees.'
      },
      {
        question: `What happens to the graph of a function in ${topicTitle} if you multiply the equation by -1?`,
        options: ['It shifts up', 'It shifts left', 'It reflects across the x-axis', 'It reflects across the y-axis'],
        correctAnswerIndex: 2,
        explanation: 'Multiplying an entire function by a negative inverses the y-values, causing an x-axis reflection.'
      },
      {
        question: `In ${topicTitle}, what is the result of any non-zero number to the power of 0?`,
        options: ['0', '1', '-1', 'Infinity'],
        correctAnswerIndex: 1,
        explanation: 'By the laws of exponents, any non-zero number raised to the power of 0 equals 1.'
      },
      {
        question: `Which theorem provides the foundational proof for ${chapterTitle}?`,
        options: ['Fundamental Theorem of Algebra', 'Mean Value Theorem', 'Binomial Theorem', 'Pythagorean Theorem'],
        correctAnswerIndex: 0,
        explanation: 'The Fundamental Theorem of Algebra states that every non-constant single-variable polynomial with complex coefficients has at least one complex root.'
      },
      {
        question: `Calculate 15% of 200 as a practical application of ${topicTitle}.`,
        options: ['20', '30', '40', '50'],
        correctAnswerIndex: 1,
        explanation: '0.15 multiplied by 200 equals 30.'
      },
      {
        question: `Why do we use variables in the algebraic context of ${topicTitle}?`,
        options: ['To confuse students', 'To represent unknown quantities', 'To make equations longer', 'Because numbers are insufficient'],
        correctAnswerIndex: 1,
        explanation: 'Variables act as placeholders for unknown or changing values in mathematical models.'
      }
    ];
  } else if (subject.includes('social') || subject.includes('history') || subject.includes('geo')) {
    questions = [
      {
        question: `In what major century did the key events of ${chapterTitle} take place?`,
        options: ['18th Century', '19th Century', '20th Century', 'Varies across eras'],
        correctAnswerIndex: 3,
        explanation: `Historical timelines surrounding ${topicTitle} span multiple significant eras.`
      },
      {
        question: `Which geographic feature played the most crucial role in the development of ${topicTitle}?`,
        options: ['Mountains', 'Rivers and coastlines', 'Deserts', 'Tundras'],
        correctAnswerIndex: 1,
        explanation: 'Rivers provided water, transport, and fertile soil, crucial for early civilizations and trade.'
      },
      {
        question: `What was the primary economic driver during the period of ${chapterTitle}?`,
        options: ['Agriculture', 'Industrial manufacturing', 'Digital technology', 'Trade and mercantilism'],
        correctAnswerIndex: 0,
        explanation: 'For most of early human history, agriculture was the foundational economic driver.'
      },
      {
        question: `Who was the predominant demographic affected by ${topicTitle}?`,
        options: ['The Aristocracy', 'The Working Class', 'The Clergy', 'Foreign Merchants'],
        correctAnswerIndex: 1,
        explanation: 'Major historical and social shifts generally have the most profound impact on the working classes.'
      },
      {
        question: `How did the political landscape change as a result of ${topicTitle}?`,
        options: ['Transitioned to Monarchy', 'Transitioned to Democracy', 'Remained unchanged', 'Led to colonization'],
        correctAnswerIndex: 1,
        explanation: 'Many modern historical shifts led to the gradual establishment of democratic institutions.'
      },
      {
        question: `What document was crucial during the events of ${chapterTitle}?`,
        options: ['The Magna Carta', 'The Constitution', 'The Declaration of Independence', 'Various local treaties'],
        correctAnswerIndex: 3,
        explanation: 'Treaties and regional agreements were standard diplomatic tools during these periods.'
      },
      {
        question: `Which cultural movement coincided with ${topicTitle}?`,
        options: ['The Renaissance', 'The Enlightenment', 'The Industrial Revolution', 'The Romantic Era'],
        correctAnswerIndex: 1,
        explanation: 'The Enlightenment promoted ideals of reason, liberty, and progress.'
      },
      {
        question: `What was the primary cause of conflict in the context of ${topicTitle}?`,
        options: ['Resource scarcity', 'Religious differences', 'Territorial expansion', 'All of the above'],
        correctAnswerIndex: 3,
        explanation: 'Historical conflicts are typically multi-faceted, involving land, ideology, and resources.'
      },
      {
        question: `How did the events of ${chapterTitle} impact global trade?`,
        options: ['It stopped trade entirely', 'It opened new maritime routes', 'It isolated nations', 'It had no effect'],
        correctAnswerIndex: 1,
        explanation: 'Many historical developments led to the discovery and utilization of new global trade routes.'
      },
      {
        question: `What is the most lasting legacy of ${topicTitle} on modern society?`,
        options: ['Technological obsolescence', 'Establishment of human rights frameworks', 'Return to feudalism', 'Decline in education'],
        correctAnswerIndex: 1,
        explanation: 'The historical struggles discussed eventually paved the way for modern civil rights.'
      }
    ];
  } else if (subject.includes('english')) {
    questions = [
      {
        question: `What is the central theme of ${topicTitle}?`,
        options: ['Love and Betrayal', 'Human versus Nature', 'The coming of age', 'It depends on the literary context'],
        correctAnswerIndex: 3,
        explanation: `The interpretation of ${topicTitle} relies heavily on literary devices and context.`
      },
      {
        question: `Identify the figure of speech commonly found in texts about ${topicTitle}: "The wind whispered through the trees."`,
        options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
        correctAnswerIndex: 2,
        explanation: 'Personification attributes human qualities (whispering) to non-human things (the wind).'
      },
      {
        question: `What is the protagonist's main conflict in the context of ${chapterTitle}?`,
        options: ['Internal conflict (Man vs Self)', 'External conflict (Man vs Society)', 'Man vs Nature', 'Both Internal and External'],
        correctAnswerIndex: 3,
        explanation: 'Complex narratives usually feature a blend of internal and external struggles.'
      },
      {
        question: `Which point of view is primarily used when discussing ${topicTitle}?`,
        options: ['First Person', 'Second Person', 'Third Person Omniscient', 'Third Person Limited'],
        correctAnswerIndex: 2,
        explanation: "Third Person Omniscient provides the narrator with full knowledge of all characters' thoughts."
      },
      {
        question: `What tone does the author set in the introduction of ${topicTitle}?`,
        options: ['Melancholic', 'Optimistic', 'Satirical', 'Objective'],
        correctAnswerIndex: 3,
        explanation: 'Educational topics are typically introduced with an objective and informative tone.'
      },
      {
        question: `Choose the correct synonym for the challenging vocabulary in ${topicTitle}: "Ubiquitous"`,
        options: ['Rare', 'Omnipresent', 'Dangerous', 'Hidden'],
        correctAnswerIndex: 1,
        explanation: 'Ubiquitous means found everywhere, or omnipresent.'
      },
      {
        question: `How does the setting influence the events of ${chapterTitle}?`,
        options: ['It creates the mood', 'It acts as an antagonist', 'It provides historical context', 'All of the above'],
        correctAnswerIndex: 3,
        explanation: 'Setting is a fundamental element that shapes the mood, challenges characters, and establishes context.'
      },
      {
        question: `Identify the correct grammatical structure often taught in ${topicTitle}: "Having finished the assignment, he turned on the TV."`,
        options: ['Dangling modifier', 'Participial phrase', 'Gerund phrase', 'Infinitive phrase'],
        correctAnswerIndex: 1,
        explanation: '"Having finished the assignment" is a participial phrase modifying "he".'
      },
      {
        question: `What is the main purpose of the persuasive arguments in ${chapterTitle}?`,
        options: ['To entertain', 'To inform', 'To convince the reader', 'To confuse'],
        correctAnswerIndex: 2,
        explanation: 'The core purpose of persuasive writing is to convince the audience to adopt a certain viewpoint.'
      },
      {
        question: `Which poetic device is prominent in classical texts of ${topicTitle}: "Peter Piper picked a peck of pickled peppers"?`,
        options: ['Assonance', 'Alliteration', 'Onomatopoeia', 'Rhyme'],
        correctAnswerIndex: 1,
        explanation: 'Alliteration is the repetition of initial consonant sounds (the letter P).'
      }
    ];
  } else {
    // Generic fallback for any other subject (like Tamil, generic topics, etc)
    questions = [
      {
        question: `Which of the following best defines ${topicTitle}?`,
        options: ['A core principle of the subject', 'A minor footnote in history', 'An outdated theory', 'A specific measurement tool'],
        correctAnswerIndex: 0,
        explanation: `${topicTitle} represents a fundamental component of the overarching ${chapterTitle} curriculum.`
      },
      {
        question: `Why is it important to study ${topicTitle} in ${chapterTitle}?`,
        options: ['To pass the exam', 'To build a foundation for advanced concepts', 'It is not actually important', 'Only for historical purposes'],
        correctAnswerIndex: 1,
        explanation: 'Mastery of foundational topics is crucial for understanding more complex, advanced concepts.'
      },
      {
        question: `What is the first step when practically applying the concepts of ${topicTitle}?`,
        options: ['Guessing the answer', 'Identifying the known variables and definitions', 'Skipping to the next chapter', 'Memorizing without understanding'],
        correctAnswerIndex: 1,
        explanation: 'Always start by identifying what is known before attempting to solve or apply concepts.'
      },
      {
        question: `Which common misconception is associated with ${topicTitle}?`,
        options: ['That it is too easy', 'That it applies to every situation universally without exception', 'That it requires no practice', 'That it was invented recently'],
        correctAnswerIndex: 1,
        explanation: 'Most concepts have specific constraints and boundary conditions where they apply.'
      },
      {
        question: `How does ${topicTitle} relate to previous topics?`,
        options: ['It completely contradicts them', 'It builds upon them logically', 'There is no relation', 'It replaces them entirely'],
        correctAnswerIndex: 1,
        explanation: 'Curriculums are designed sequentially, where new topics logically extend prior learning.'
      },
      {
        question: `Identify a practical real-world scenario where ${topicTitle} is useful.`,
        options: ['Everyday problem solving', 'Only in academic research', 'Never', 'During sleep'],
        correctAnswerIndex: 0,
        explanation: 'Theoretical knowledge typically translates to improved critical thinking in everyday scenarios.'
      },
      {
        question: `What is the most effective way to revise ${topicTitle}?`,
        options: ['Reading it once', 'Active recall and solving practice questions', 'Ignoring it until the exam', 'Watching TV while reading'],
        correctAnswerIndex: 1,
        explanation: 'Active recall and practice are scientifically proven to be the most effective study techniques.'
      },
      {
        question: `Which secondary skill is developed while mastering ${chapterTitle}?`,
        options: ['Physical strength', 'Critical thinking and analytical skills', 'Musical ability', 'None'],
        correctAnswerIndex: 1,
        explanation: 'Academic subjects invariably improve overall cognitive and analytical capabilities.'
      },
      {
        question: `In a standard examination, what type of question is typically asked about ${topicTitle}?`,
        options: ['Application and analysis', 'Only true/false', 'Drawing only', 'Verbal recitation'],
        correctAnswerIndex: 0,
        explanation: 'Modern board exams prioritize testing higher-order thinking, application, and analysis.'
      },
      {
        question: `What should you do if you struggle with ${topicTitle}?`,
        options: ['Give up', 'Break it down into smaller, manageable sub-topics', 'Memorize the answers', 'Skip the chapter'],
        correctAnswerIndex: 1,
        explanation: 'Chunking complex information makes it significantly easier to process and understand.'
      }
    ];
  }

  questions = questions.map((q, qIndex) => {
    q.id = 'gen_q_' + qIndex;
    const originalOptions = [...q.options];
    const correctStr = originalOptions[q.correctAnswerIndex];
    const shuffledOptions = shuffle(originalOptions);
    const newCorrectIndex = shuffledOptions.indexOf(correctStr);
    return {
      ...q,
      options: shuffledOptions,
      correctAnswerIndex: newCorrectIndex
    };
  });

  return shuffle(questions).slice(0, 10);
}

export function generateQuizForChapter(classId: string, subjectId: string, chapterId: string, chapterTitle: string) {
  const questions = generateQuiz(subjectId, chapterTitle, chapterTitle);
  return {
    id: `quiz_${chapterId}`,
    title: `${chapterTitle} Quiz`,
    subjectId,
    chapterId,
    durationMinutes: 10,
    questions
  };
}

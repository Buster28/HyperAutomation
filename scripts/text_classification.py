#!/usr/bin/env python
# coding: utf-8

# In[ ]:


#28-Jul-20 Hackathon 2020 

import pandas as pd 
df = pd.read_excel('C:/Users/bhparuch/Desktop/Hack_2020/OCV_Data_Training.xlsx')  

df.columns
# Index(['TranslatedText', 'SourcePageUri', 'Intent', 'Web / App', 'Browser'], dtype='object')

training_data = df[['TranslatedText','Intent']]
#training_data.columns = ['sent','class']

#follow data preprocessing steps (BELOW) before building a model

from sklearn.feature_extraction.text import CountVectorizer

docs = [row['TranslatedText'] for index,row in training_data.iterrows()]

vec = CountVectorizer()
X = vec.fit_transform(docs)

total_features = len(vec.get_feature_names())
total_features

y = training_data['Intent']

#data is not enough to do training, testing etc, 
#only ~220 records so using complete data to build model
#from sklearn.model_selection import train_test_split 
#X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=0)


from sklearn.naive_bayes import MultinomialNB
clf = MultinomialNB()

clf.fit(X, y)
#clf  object /class has Data, model output also 

#predict on training data 

clf.predict(X)


#predit on user given input 
#t = 'Autofill'
#vec.transform([t])

import pandas as pd 
t = pd.read_excel('C:/Users/bhparuch/Desktop/Hack_2020/OCV_Data_UserInput_Testing.xlsx')  
docs = [row['TranslatedText'] for index,row in t.iterrows()]
predlabels = pd.DataFrame(clf.predict(vec.transform(docs)),columns=['Intent_modeloutput'])


clf.predict(vec.transform(t))

output = pd.concat([t,predlabels],axis=1)
output.to_csv("C:/Users/bhparuch/Desktop/Hack_2020/OCV_Data_Testing_model_output.csv")

output.columns

#Index(['TranslatedText', 'Intent_modeloutput'], dtype='object')


# In[ ]:


#Pre-processing data: tokenization, stemming, and removal of stop words
    
import nltk
To open dialog download:
nltk.download();
To downlaod just stopwords:
nltk.download('stopwords');

#convert all text to lower case.

training_data['TranslatedText'] = training_data['TranslatedText'].str.lower()

# Tokenization

def identify_tokens(row):
    TranslatedText = row['TranslatedText']
    tokens = nltk.word_tokenize(TranslatedText)
    # taken only words (not punctuation)
    token_words = [w for w in tokens if w.isalpha()]
    return token_words


#Stemming

from nltk.stem import PorterStemmer
stemming = PorterStemmer()

my_list = ['autofill', 'autofilling', 'saving', 'save', 'promting', 'prompt']

# Using a Python list comprehension method to apply to all words in my_list

print ([stemming.stem(word) for word in my_list])


# define a function and apply it to our DataFrame.

def stem_list(row):
    my_list = row['words']
    stemmed_list = [stemming.stem(word) for word in my_list]
    return (stemmed_list)

training_data['stemmed_words'] = training_data.apply(stem_list, axis=1)

# Removing stop words

from nltk.corpus import stopwords
stops = set(stopwords.words("english"))                  

def remove_stops(row):
    my_list = row['stemmed_words']
    meaningful_words = [w for w in my_list if not w in stops]
    return (meaningful_words)

training_data['stem_meaningful'] = training_data.apply(remove_stops, axis=1)

#Rejoin words

def rejoin_words(row):
    my_list = row['stem_meaningful']
    joined_words = ( " ".join(my_list))
    return joined_words

training_data['processed'] = training_data.apply(rejoin_words, axis=1)

# Save processed data

cols_to_drop = ['Unnamed: 0', 'review', 'words', 'stemmed_words', 'stem_meaningful']
training_data.drop(cols_to_drop, inplace=True)

training_data.to_csv('C:/Users/bhparuch/Desktop/Hack_2020/OCV_Data_Training.csv', index=False)